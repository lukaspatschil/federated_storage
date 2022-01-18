import { Controller } from '@nestjs/common';
import {
  SensorDataServiceController,
  SensorDataServiceControllerMethods,
} from './service-types/types/proto/sensorData';
import {
  Id,
  SensorDataCreation,
  SensorDataUpdate,
} from './service-types/types/proto/shared';
import { SensordataService } from './sensordata.service';

@Controller()
@SensorDataServiceControllerMethods()
export class SensordataController implements SensorDataServiceController {
  constructor(private readonly sensordataService: SensordataService) {}

  async createSensorData(sensorDataCreation: SensorDataCreation) {
    return this.sensordataService.createSensorData(sensorDataCreation);
  }

  getSensorDataById(request: Id) {
    return this.sensordataService.getSensorDataById(request);
  }

  getAllSensorData() {
    return this.sensordataService.getAllSensorData();
  }

  async getPictureById(request: Id) {
    return this.sensordataService.getPictureById(request);
  }

  async removeSensorDataById(request: Id) {
    return this.sensordataService.removeSensorDataById(request);
  }

  async updateSensorDataById(sensorDataUpdate: SensorDataUpdate) {
    return this.sensordataService.updateSensorDataById(sensorDataUpdate);
  }
}
