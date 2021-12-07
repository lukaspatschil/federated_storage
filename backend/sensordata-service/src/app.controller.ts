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
    const sensorDataSubject = new Subject<Empty>();
    request.subscribe((sensorDataCreation) => {
      const { data, ...pictureWithoutData } = sensorDataCreation.picture;

      const createPictureById = of({
        id: '1',
        mimetype: pictureWithoutData.mimetype,
        data: data,
      });
      this.pictureStorageM
        .createPictureById(createPictureById)
        .subscribe(() => {
          sensorDataSubject.next({});
        });
    });
    return sensorDataSubject.asObservable();

    /*
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
          });
        });
    });

    return sensorDataSubject;
    */

    // -- Dummy Response --
    const subject = new Subject<Empty>();

    const onNext = (message) => {
      console.log(message);
      subject.next({});
    };
    const onComplete = () => subject.complete();
    request.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }

  getSensorDataById(request: Id) {
    /*
    // -- Real Response --
    return this.sensorDataStorage.getSensorDataById(request);
    */

    // -- Dummy Response --
    const sensorData: SensorData = {
      id: '1',
      pictures: [
        {
          id: '1',
          createdAt: '2011-10-05T14:48:00.000Z',
          mimetype: 'image/png',
        },
      ],
      metadata: {
        name: 'GRASMERE 1',
        placeIdent: '6ea10ab8-2e32-11e9-b03f-dca9047ef277',
        seqId: '6ea10ab8-2e32-11e9-b03f-dca9047ef277',
        datetime: '22-Apr-2019 (00:53:00.000000)',
        frameNum: 1,
        seqNumFrames: 1,
        filename: '0a914caf-2bfa-11e9-bcad-06f10d5896c4.jpg',
        deviceID: 'b3f129b8-59f2-458f-bf2f-f0c1af0032d3',
        location: {
          longitude: -115.9043718414795,
          latitude: 42.38461654217346,
        },
        tags: [],
      },
    };

    return sensorData;
  }

  getAllSensorData() {
    /*
    // -- Real Response --
    return this.sensorDataStorage.getAllSensorData({});
    */

    // -- Dummy Response --
    return { sensorData: [] };
  }

  getPictureById(request: Id) {
    /*
    // -- Real Response --
    const pictureSubject = new Subject<Picture>();

    this.sensorDataStorage
      .getPictureWithoutDataById(request)
      .subscribe((pictureWithoutData: PictureWithoutData) => {
        const idWithMimetype: IdWithMimetype = {
          id: pictureWithoutData.id,
          mimetype: pictureWithoutData.mimetype,
        };

        const pictureData$ = [
          this.pictureStorageD.getPictureById(idWithMimetype),
          this.pictureStorageM.getPictureById(idWithMimetype),
        ];

        forkJoin(pictureData$).subscribe((res) => {
          const [pictureDataD, pictureDataM] = res;

          const picture: Picture = {
            id: pictureWithoutData.id,
            createdAt: pictureWithoutData.createdAt,
            mimetype: pictureWithoutData.mimetype,
            data: pictureDataD.data,
          };

          pictureSubject.next(picture);
        });
      });

    return pictureSubject.asObservable();
    */

    // -- Dummy Response --
    const pictureSubject = new Subject<Picture>();

    const idWithMimetype: IdWithMimetype = {
      id: request.id,
      mimetype: 'text/lol',
    };

    this.pictureStorageM
      .getPictureById(idWithMimetype)
      .subscribe((pictureData) => {
        const pictureDummy: Picture = {
          id: request.id,
          mimetype: 'text/lol',
          data: pictureData.data,
          createdAt: '2011-10-05T14:48:00.000Z',
        };
        pictureSubject.next(pictureDummy);
      });

    return pictureSubject.asObservable();
  }

  async removeSensorDataById(request: Id) {
    /*
    // -- Real Response --
    const pictureWithoutData = await firstValueFrom(
      this.sensorDataStorage.getPictureWithoutDataById(request),
    );

    const idWithMimetype: IdWithMimetype = {
      id: pictureWithoutData.id,
      mimetype: pictureWithoutData.mimetype,
    };
    await firstValueFrom(
      this.pictureStorageD.removePictureById(idWithMimetype),
    );
    await firstValueFrom(
      this.pictureStorageM.removePictureById(idWithMimetype),
    );
    await firstValueFrom(this.sensorDataStorage.removeSensorDataById(request));
    return {};
    */

    // -- Dummy Response --
    return {};
  }
}
