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
import { SensordataService } from './sensordata.service';

@Controller()
@SensorDataServiceControllerMethods()
export class SensordataController implements SensorDataServiceController {

    constructor(private readonly sensordataService: SensordataService) {
    }

    async createSensorData(sensorDataCreation: SensorDataCreation) {
        return this.sensordataService.createSensorData(sensorDataCreation)
    }

    getSensorDataById(request: Id) {
        return this.sensordataService.getSensorDataById(request)
    }

    getAllSensorData() {
        return this.sensordataService.getAllSensorData()
    }

    async getPictureById(request: Id) {
        return this.sensordataService.getPictureById(request)
    }

    async removeSensorDataById(request: Id) {
        return this.sensordataService.removeSensorDataById(request)
    }
}
