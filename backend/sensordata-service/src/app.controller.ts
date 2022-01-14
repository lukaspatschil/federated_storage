import { Controller, Inject, Logger } from '@nestjs/common';
import {
  SensorDataServiceController,
  SensorDataServiceControllerMethods,
} from './service-types/types/proto/sensorData';
import { Observable, Subject, of, firstValueFrom, forkJoin } from 'rxjs';
import {
  IdWithMimetype,
  Picture,
  PictureWithoutData,
  SensorData,
} from './service-types/types/proto/shared';
import {
  Empty,
  Id,
  SensorDataCreation,
} from './service-types/types/proto/shared';
import { PictureStorageServiceClient } from './service-types/types/proto/pictureStorage';
import { SensorDataStorageServiceClient } from './service-types/types/proto/sensorDataStorage';
import { ClientGrpc } from '@nestjs/microservices';
import * as crypto from 'crypto';
import { Replica } from './service-types/types';

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
  ) {}

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

  createSensorData(request: Observable<SensorDataCreation>) {
    this.logger.log('createSensorData(): started');

    const sensorDataSubject = new Subject<SensorData>();

    request.subscribe((sensorDataCreation) => {
      const { data, mimetype } = sensorDataCreation.picture;

      const hash = crypto
        .createHash('sha256')
        .update(sensorDataCreation.picture.data)
        .digest('hex');

      const pictureWithoutData = { mimetype, hash };

      this.sensorDataStorage.createSensorData({
          metadata: sensorDataCreation.metadata,
          picture: pictureWithoutData,
        }).subscribe((sensorData) => {
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
            this.pictureStorageD.createPictureById(createPictureById),
            this.pictureStorageM.createPictureById(createPictureById),
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

        const pictureData$ = [
          this.pictureStorageD.getPictureById(idWithMimetype),
          this.pictureStorageM.getPictureById(idWithMimetype),
        ] as const;

        forkJoin(pictureData$).subscribe((res) => {
          this.logger.log('getPictureById(): fetched images');
          const [pictureDataD, pictureDataM] = res;

          const hashM = crypto
            .createHash('sha256')
            .update(pictureDataM.data)
            .digest('hex');
          const hashD = crypto
            .createHash('sha256')
            .update(pictureDataD.data)
            .digest('hex');

          // Maybe for the future?
          // const replicaStatus = this.compareHash(
          //   pictureWithoutData.hash,
          //   hashM,
          //   hashD,
          // );

          const picture: Picture = {
            id: pictureWithoutData.id,
            createdAt: pictureWithoutData.createdAt,
            mimetype: pictureWithoutData.mimetype,
            data: pictureDataM.data,
            replica: hashD === hashM ? Replica.OK : Replica.FAULTY,
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

  private compareHash(hash1: string, hash2: string, hash3: string): Replica {
    if (hash1 === hash2 && hash1 === hash3) {
      return Replica.OK;
    } else if (hash1 === hash2 || hash1 === hash3) {
      return Replica.FAULTY;
    } else {
      return Replica.MISSING;
    }
  }
}
