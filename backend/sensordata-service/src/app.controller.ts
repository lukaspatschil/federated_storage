import {Controller, Inject, Logger} from '@nestjs/common';
import {
    SensorDataServiceController,
    SensorDataServiceControllerMethods,
} from './service-types/types/proto/sensorData';
import {
    Observable,
    Subject,
    of,
    firstValueFrom,
    forkJoin,
    catchError,
} from 'rxjs';
import {
    IdWithMimetype,
    Picture,
    PictureData,
    PictureWithoutData,
} from './service-types/types/proto/shared';
import {
    Empty,
    Id,
    SensorDataCreation,
} from './service-types/types/proto/shared';
import {PictureStorageServiceClient} from './service-types/types/proto/pictureStorage';
import {SensorDataStorageServiceClient} from './service-types/types/proto/sensorDataStorage';
import {ClientGrpc, RpcException} from '@nestjs/microservices';
import * as crypto from 'crypto';
import {Replica} from './service-types/types';
import {rejects} from 'assert';
import {status} from '@grpc/grpc-js';
import * as Buffer from "buffer";

@Controller()
@SensorDataServiceControllerMethods()
export class AppController implements SensorDataServiceController {
    private logger = new Logger('sensordata-service controller');

    private pictureStorageM: PictureStorageServiceClient;
    private pictureStorageD: PictureStorageServiceClient;
    private sensorDataStorage: SensorDataStorageServiceClient;

    constructor(
        @Inject('MINIO_PACKAGE') private minioClient: ClientGrpc,
        @Inject('DROPBOX_PACKAGE') private dropboxClient: ClientGrpc,
        @Inject('MONGODB_PACKAGE') private mongodbClient: ClientGrpc,
    ) {
    }

    onModuleInit() {
        this.pictureStorageM =
            this.minioClient.getService<PictureStorageServiceClient>(
                'PictureStorageService',
            );
        this.pictureStorageD =
            this.dropboxClient.getService<PictureStorageServiceClient>(
                'PictureStorageService',
            );
        this.sensorDataStorage =
            this.mongodbClient.getService<SensorDataStorageServiceClient>(
                'SensorDataStorageService',
            );
    }

    async createSensorData(sensorDataCreation: SensorDataCreation) {
        this.logger.log('createSensorData(): started');

        const {data, mimetype} = sensorDataCreation.picture;

        const hash = crypto
            .createHash('sha256')
            .update(sensorDataCreation.picture.data)
            .digest('hex');

        const pictureWithoutData = {mimetype, hash};
        const sensorData = await firstValueFrom(
            this.sensorDataStorage.createSensorData({
                metadata: sensorDataCreation.metadata,
                picture: pictureWithoutData,
            }),
        );

        // ATTENTION: This may not work with multiple pictures, especially regarding concurrency
        const lastPicture = sensorData.pictures[sensorData.pictures.length - 1];

        this.logger.log(
            'createSensorData(): start saving pictures with id: ' + lastPicture.id,
        );

        const createPictureById = {
            id: lastPicture.id,
            mimetype: pictureWithoutData.mimetype,
            data: data,
        };
        await firstValueFrom(
            forkJoin([
                this.pictureStorageD.createPictureById(createPictureById),
                this.pictureStorageM.createPictureById(createPictureById),
            ]),
        );
        this.logger.log('createSensorData(): finished');
    }

    getSensorDataById(request: Id) {
        this.logger.log(`getSensorDataById( ${request.id} )`);
        return this.sensorDataStorage.getSensorDataById(request);
    }

    getAllSensorData() {
        this.logger.log('getAllSensorData()');
        return this.sensorDataStorage.getAllSensorData({});
    }

    async getPictureById(request: Id) {
        this.logger.log(`getPictureById( ${request.id} )`);

        const pictureWithoutData = await firstValueFrom(
            this.sensorDataStorage.getPictureWithoutDataById(request),
        );

        this.logger.log('getPictureById(): fetched sensordata id');

        const idWithMimetype: IdWithMimetype = {
            id: pictureWithoutData.id,
            mimetype: pictureWithoutData.mimetype,
        };

        const results = await Promise.allSettled([
            firstValueFrom(this.pictureStorageD.getPictureById(idWithMimetype)),
            firstValueFrom(this.pictureStorageM.getPictureById(idWithMimetype)),
        ]);

        const [resultD, resultM] = results;

        let picture: Picture = {
            id: pictureWithoutData.id,
            createdAt: pictureWithoutData.createdAt,
            mimetype: pictureWithoutData.mimetype,
            data: null,
            replica: null
        };;
        if (resultD.status === 'rejected' && resultM.status === 'rejected') {
            throw new RpcException({
                code: status.INTERNAL,
                message: 'error when fetching images',
            });
        } else if(resultD.status === 'rejected' || resultM.status === 'rejected'){
            if(resultD.status === 'rejected' && resultM.status === 'fulfilled'){
                // dropbox file missing, replace dropbox
                this.replicateData(pictureWithoutData, resultM.value.data, this.pictureStorageD)
                picture.data = resultM.value.data

            } else if (resultD.status === "fulfilled" && resultM.status === "rejected"){
                // minIO files missing, replace MinIO
                this.replicateData(pictureWithoutData, resultD.value.data, this.pictureStorageM)
                picture.data = resultD.value.data
            }
            picture.replica = Replica.REPLICATED
        } else{
            const pictureDataM = resultM.value;
            const pictureDataD = resultD.value;

            const [replicaStatus, data] = this.replicate(pictureWithoutData, pictureDataM.data, pictureDataD.data);
            picture.data = data
            picture.replica = replicaStatus

        }

        this.logger.log('getPictureById(): finished');
        return picture;
    }

    async removeSensorDataById(request: Id) {
        this.logger.log(`removeSensorDataById( ${request.id} )`);

        const sensordata = await firstValueFrom(
            this.sensorDataStorage.getSensorDataById(request),
        );

        const requests: Promise<Empty>[] = [];
        for (const picture of sensordata.pictures) {
            requests.push(
                firstValueFrom(this.pictureStorageD.removePictureById(picture)),
            );
            requests.push(
                firstValueFrom(this.pictureStorageM.removePictureById(picture)),
            );
        }
        await Promise.all(requests);

        await firstValueFrom(this.sensorDataStorage.removeSensorDataById(request));
        return {};
    }

    private replicate(
        pictureData: PictureWithoutData,
        pictureMinio: Buffer,
        pictureDropbox: Buffer): [Replica, Buffer] {

        const hashMinio = crypto
            .createHash('sha256')
            .update(pictureMinio)
            .digest('hex');
        const hashDropbox = crypto
            .createHash('sha256')
            .update(pictureDropbox)
            .digest('hex');

        if (pictureData.hash === hashMinio && pictureData.hash === hashDropbox) {
            this.logger.log("sensordata getPictureById(): Status OK")
            return [Replica.OK, pictureMinio]
        } else if (pictureData.hash === hashMinio || pictureData.hash === hashDropbox) {
            // replace faulty image
            this.logger.error("sensordata getPictureById(): images need to be replaced")
            if (pictureData.hash === hashMinio) {
                // replace dropbox
                this.logger.error("sensordata getPictureById(): Status REPLICATED: Dropbox file faulty")
                this.replicateData(pictureData, pictureMinio, this.pictureStorageD)
                return [Replica.REPLICATED, pictureMinio]
            } else {
                // replace Monio
                this.logger.error("sensordata getPictureById(): Status REPLICATED: MinIO file faulty")
                this.replicateData(pictureData, pictureDropbox, this.pictureStorageM)
                return [Replica.REPLICATED, pictureDropbox]
            }
        } else {
            // not possible to determine the correct image
            this.logger.log("sensordata getPictureById(): Status MISSING: All files faulty")
            return [Replica.MISSING, null]
        }
    }

    private replicateData(pictureData: PictureWithoutData, picture: Buffer, storage: PictureStorageServiceClient) {
        const createPictureById = {
            id: pictureData.id,
            mimetype: pictureData.mimetype,
            data: picture,
        };
        storage.createPictureById(createPictureById)
            .subscribe((response: Empty) => {
                this.logger.log("Sensordata Service replicateData(): finished")
            })
    }

}
