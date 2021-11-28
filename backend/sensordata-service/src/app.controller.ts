import { Controller, Inject, Logger } from '@nestjs/common';
import {
  SensorDataServiceController,
  SensorDataServiceControllerMethods,
} from './service-types/types/proto/sensorData';
import { Observable, Subject, of } from 'rxjs';
import { Picture } from './service-types/types/proto/picture';
import {
  Empty,
  Id,
  SensorData,
  SensorDataCreation,
} from './service-types/types/proto/shared';

@Controller()
@SensorDataServiceControllerMethods()
export class AppController implements SensorDataServiceController {
  private logger = new Logger('sensordata-service controller');

  /*
  private minIOService: MinIOServiceClient;
  private dropboxService: DropboxServiceClient;
  private mongodbService: MongoDBServiceClient;
  */

  /*
  constructor(
    
    @Inject('MINIO_PACKAGE') private minioClient: ClientGrpc,
    @Inject('DROPBOX_PACKAGE') private dropboxClient: ClientGrpc,
    @Inject('MONGODB_PACKAGE') private mongodbClient: ClientGrpc,
    
  ) {}
 

  onModuleInit() {
    this.minIOService =
      this.minioClient.getService<MinIOServiceClient>('MinIOService');

    this.dropboxService =
      this.dropboxClient.getService<DropboxServiceClient>('DropboxService');

    this.mongodbService =
      this.mongodbClient.getService<MongoDBServiceClient>('MongoDBService'); 
  }
  */

  //@GrpcStreamMethod('SensorDataService', 'CreateSensorData')
  createSensorData(request: Observable<SensorDataCreation>) {
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

  //@GrpcMethod('SensorDataService', 'GetSensorDataById')
  getSensorDataById(request: Id) {
    const sensorData: SensorData = {
      id: '1',
      pictures: [],
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

  //@GrpcMethod('SensorDataService', 'GetAllSensorData')
  getAllSensorData() {
    return { sensorData: [] };
  }

  //@GrpcMethod('SensorDataService', 'GetPictureById')
  getPictureById(request: Id) {
    const picture: Picture = {
      id: 'a1',
      mimetype: 'text/lol',
      data: Buffer.from('asdf', 'base64'),
      createdAt: '2011-10-05T14:48:00.000Z',
    };

    return of(picture);
  }

  //@GrpcMethod('SensorDataService', 'RemoveSensorDataById')
  removeSensorDataById(request: Id) {
    return {};
  }

  /*
  @GrpcMethod('PictureService', 'FindOne')
  async findOne(
    data: PictureById,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<Observable<Picture>> {
    this.dropboxService
      .findOne(data)
      .subscribe(({ id }) => console.log(`The dropbox gets image with ${id}`));

    this.mongodbService
      .findOne(data)
      .subscribe(({ id }) => console.log(`The mongo says ${id}`));

    return this.minIOService.findOne(data);
  }
  */
}
