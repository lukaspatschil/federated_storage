import { Controller, Inject, Logger } from '@nestjs/common';
import {
  SensorDataServiceController,
  SensorDataServiceControllerMethods,
} from './service-types/types/proto/sensorData';
import { Observable, Subject, of, firstValueFrom, forkJoin, catchError, map } from 'rxjs';
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
import { PictureStorageServiceClient } from './service-types/types/proto/pictureStorage';
import { SensorDataStorageServiceClient } from './service-types/types/proto/sensorDataStorage';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import * as crypto from 'crypto';
import { Replica } from './service-types/types';
import * as Buffer from "buffer";
import { status } from '@grpc/grpc-js';

@Controller()
@SensorDataServiceControllerMethods()
export class AppController implements SensorDataServiceController {
  private logger = new Logger('sensordata-service controller');

  private pictureStorageMinio: PictureStorageServiceClient;
  private pictureStorageDropbox: PictureStorageServiceClient;
  private sensorDataStorage: SensorDataStorageServiceClient;

  constructor(
    @Inject('MINIO_PACKAGE') private minioClient: ClientGrpc,
    @Inject('DROPBOX_PACKAGE') private dropboxClient: ClientGrpc,
    @Inject('MONGODB_PACKAGE') private mongodbClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.pictureStorageMinio =
      this.minioClient.getService<PictureStorageServiceClient>(
        'PictureStorageService',
      );
    this.pictureStorageDropbox =
      this.dropboxClient.getService<PictureStorageServiceClient>(
        'PictureStorageService',
      );
    this.sensorDataStorage =
      this.mongodbClient.getService<SensorDataStorageServiceClient>(
        'SensorDataStorageService',
      );
  }

  createSensorData(request: Observable<SensorDataCreation>) {
    this.logger.log('createSensorData(): started');

    const sensorDataSubject = new Subject<Empty>();

    request.subscribe((sensorDataCreation) => {
      const { data, mimetype } = sensorDataCreation.picture;

      const hash = crypto
        .createHash('sha256')
        .update(sensorDataCreation.picture.data)
        .digest('hex');

      const pictureWithoutData = { mimetype, hash };

      this.sensorDataStorage
        .createSensorData({
          metadata: sensorDataCreation.metadata,
          picture: pictureWithoutData,
        })
        .subscribe((sensorData) => {
          // ATTENTION: This may not work with multiple pictures, especially regarding concurrency
          const lastPicture =
            sensorData.pictures[sensorData.pictures.length - 1];

          this.logger.log(
            'createSensorData(): start saving pictures with id: ' +
              lastPicture.id,
          );

          const createPictureById = of({
            id: lastPicture.id,
            mimetype: pictureWithoutData.mimetype,
            data: data,
          });

          const createPictures$ = [
            this.pictureStorageDropbox.createPictureById(createPictureById),
            this.pictureStorageMinio.createPictureById(createPictureById),
          ];

          forkJoin(createPictures$).subscribe(() => {
            sensorDataSubject.next(sensorData);
            sensorDataSubject.complete();
            this.logger.log('createSensorData(): finished');
          });
        });
    });

    return sensorDataSubject;
  }

  getSensorDataById(request: Id) {
    this.logger.log(`getSensorDataById( ${request.id} )`);
    return this.sensorDataStorage.getSensorDataById(request);
  }

  getAllSensorData() {
    this.logger.log('getAllSensorData()');
    return this.sensorDataStorage.getAllSensorData({});
  }

  getPictureById(request: Id) {
    this.logger.log(`getPictureById( ${request.id} )`);

    const pictureSubject = new Subject<Picture>();

    this.sensorDataStorage
      .getPictureWithoutDataById(request)
      .subscribe((pictureWithoutData: PictureWithoutData) => {
        this.logger.log('getPictureById(): fetched sensordata id');

        const idWithMimetype: IdWithMimetype = {
          id: pictureWithoutData.id,
          mimetype: pictureWithoutData.mimetype,
        };

        const emptyPictureData: PictureData = {
          data: null,
        }

        const pictureData$ = [
          this.pictureStorageDropbox.getPictureById(idWithMimetype).pipe(
              catchError(err => {
                this.logger.error(err);
                return of(emptyPictureData)}),
          ),
          this.pictureStorageMinio.getPictureById(idWithMimetype).pipe(
              catchError(err => {
                this.logger.error(err);
                return of(emptyPictureData)}),
          )
        ] as const;

        forkJoin(pictureData$).subscribe((res) => {
          this.logger.log('getPictureById(): fetched images');
          const [pictureDataD, pictureDataM] = res;

          this.logger.log('getPictureById(): fetched images - Dropbox picture data: ' + pictureDataD)
          this.logger.log('getPictureById(): fetched images - MinIO picture data: ' + pictureDataM)

          if(pictureDataD.data === null && pictureDataM.data === null){
            this.logger.error("MinIO and Dropbox file invalid")
            // TODO throw exception
            /*throw new RpcException({
              code: status.INTERNAL,
              message: "MinIO and Dropbox file invalid",
            });*/
          }

          const hashD = crypto
            .createHash('sha256')
            .update(pictureDataD.data)
            .digest('hex');
          const hashM = crypto
              .createHash('sha256')
              .update(pictureDataM.data)
              .digest('hex');

          this.logger.log('getPictureById(): fetched images - Hash DropboxData: ' + hashD)
          this.logger.log('getPictureById(): fetched images - Hash MinIOData: ' + hashM)

          const [status, data] = this.replicate(pictureWithoutData, pictureDataM.data, pictureDataD.data);

          const picture: Picture = {
            id: pictureWithoutData.id,
            createdAt: pictureWithoutData.createdAt,
            mimetype: pictureWithoutData.mimetype,
            data: data,
            replica: status
          };

          pictureSubject.next(picture);
          pictureSubject.complete();
          this.logger.log('getPictureById(): finished');
        });
      });

    return pictureSubject.asObservable();
  }

  async removeSensorDataById(request: Id) {
    this.logger.log(`removeSensorDataById( ${request.id} )`);

    const sensordata = await firstValueFrom(
      this.sensorDataStorage.getSensorDataById(request),
    );

    const requests: Promise<Empty>[] = [];
    for (const picture of sensordata.pictures) {
      requests.push(
        firstValueFrom(this.pictureStorageDropbox.removePictureById(picture)),
      );
      requests.push(
        firstValueFrom(this.pictureStorageMinio.removePictureById(picture)),
      );
    }
    await Promise.all(requests);

    await firstValueFrom(this.sensorDataStorage.removeSensorDataById(request));
    return {};
  }

/*  private compareHash(hash1: string, hash2: string, hash3: string): Replica {
    if (hash1 === hash2 && hash1 === hash3) {
      return Replica.OK;
    } else if (hash1 === hash2 || hash1 === hash3) {
      return Replica.FAULTY;
    } else {
      return Replica.MISSING;
    }
  }*/

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
      if (pictureData.hash === hashMinio){
        // replace dropbox
        this.logger.error("sensordata getPictureById(): Status REPLICATED: Dropbox file faulty")
        this.replicateData(pictureData, pictureMinio, this.pictureStorageDropbox)
        return [Replica.REPLICATED, pictureMinio]
      } else{
        // replace Monio
        this.logger.error("sensordata getPictureById(): Status REPLICATED: MinIO file faulty")
        this.replicateData(pictureData, pictureDropbox, this.pictureStorageMinio)
        return [Replica.REPLICATED, pictureDropbox]
      }
    } else {
      // not possible to determine the correct image
      this.logger.log("sensordata getPictureById(): Status MISSING: All files faulty")
      return [Replica.MISSING, null]
    }
  }

  private replicateData(pictureData: PictureWithoutData, picture: Buffer, storage: PictureStorageServiceClient){
    const createPictureById = of({
      id: pictureData.id,
      mimetype: pictureData.mimetype,
      data: picture,
    });
    storage.createPictureById(createPictureById)
        .subscribe((response: Empty) => {
          this.logger.log("Sensordata Service replicateData(): finished" )
    })
  }

  private determineIfIsAnimalOrHuman(toBeDetermined: PictureData | Error): Boolean {
    if((toBeDetermined as PictureData)){
      return true
    }
    return false
  }

}
