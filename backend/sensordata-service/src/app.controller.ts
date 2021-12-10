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
} from './service-types/types/proto/shared';
import {
  Empty,
  Id,
  SensorData,
  SensorDataCreation,
} from './service-types/types/proto/shared';
import { PictureStorageServiceClient } from './service-types/types/proto/pictureStorage';
import { SensorDataStorageServiceClient } from './service-types/types/proto/sensorDataStorage';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

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
    // -- Real Response --
    const sensorDataSubject = new Subject<Empty>();

    request.subscribe((sensorDataCreation) => {
      const { data, ...pictureWithoutData } = sensorDataCreation.picture;

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
            //this.pictureStorageD.createPictureById(createPictureById),
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
          //this.pictureStorageD.getPictureById(idWithMimetype),
          this.pictureStorageM.getPictureById(idWithMimetype),
        ];

        forkJoin(pictureData$).subscribe((res) => {
          this.logger.log('getPictureById(): fetched images');
          const [pictureDataM] = res;

          const picture: Picture = {
            id: pictureWithoutData.id,
            createdAt: pictureWithoutData.createdAt,
            mimetype: pictureWithoutData.mimetype,
            data: pictureDataM.data,
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

    for (const picture of sensordata.pictures) {
      await firstValueFrom(this.pictureStorageM.removePictureById(picture));
    }

    await firstValueFrom(this.sensorDataStorage.removeSensorDataById(request));
    return {};
  }
}
