import { Controller, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  SensorDataStorageServiceClient,
  SensorDataStorageServiceControllerMethods,
} from './service-types/types/proto/sensorDataStorage';
import {
  Empty,
  Id,
  PictureWithoutData,
  SensorData,
  SensorDataArray,
  SensorDataCreationWithoutPictureData,
} from './service-types/types/proto/shared';

@Controller()
@SensorDataStorageServiceControllerMethods()
export class MongoDBController implements SensorDataStorageServiceClient {
  private readonly logger = new Logger(MongoDBController.name);

  createSensorData(
    request: SensorDataCreationWithoutPictureData,
  ): Observable<SensorData> {
    return null;
  }

  getSensorDataById(request: Id): Observable<SensorData> {
    return null;
  }

  getAllSensorData(request: Empty): Observable<SensorDataArray> {
    return null;
  }

  removeSensorDataById(request: Id): Observable<Empty> {
    return null;
  }

  getPictureWithoutDataById(request: Id): Observable<PictureWithoutData> {
    return null;
  }
}
