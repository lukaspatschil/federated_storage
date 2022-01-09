import { Controller, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { MongoDBService } from './mongodb.service';
import {
  SensorDataStorageServiceController,
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
export class MongoDBController implements SensorDataStorageServiceController {
  private readonly logger = new Logger(MongoDBController.name);

  constructor(private readonly mongodbService: MongoDBService) {
    this.logger.log('MongoDBController created');
  }

  createSensorData(
    request: SensorDataCreationWithoutPictureData,
  ): Observable<SensorData> {
    this.logger.log(`Creating sensor data. ${JSON.stringify(request)}`);

    return from(this.mongodbService.createOne(request));
  }

  getSensorDataById(request: Id): Observable<SensorData> {
    this.logger.log(`Retrieving sensor data by id. ${JSON.stringify(request)}`);

    return from(this.mongodbService.findOne(request.id));
  }

  getAllSensorData(request: Empty): Observable<SensorDataArray> {
    this.logger.log(`Retrieving sensor data. ${JSON.stringify(request)}`);

    return from(this.mongodbService.findAll());
  }

  removeSensorDataById(request: Id): Observable<Empty> {
    this.logger.log(`Removing sensor data by id. ${JSON.stringify(request)}`);

    return from(this.mongodbService.deleteOne(request.id));
  }

  getPictureWithoutDataById(request: Id): Promise<PictureWithoutData> {
    this.logger.log(
      `Retrieving picture data by id. ${JSON.stringify(request)}`,
    );

    return this.mongodbService.findOnePicture(request.id);
  }
}
