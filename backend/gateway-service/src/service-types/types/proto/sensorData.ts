/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Observable } from 'rxjs';
import {
  Empty,
  SensorData,
  SensorDataArray,
  Picture,
  SensorDataCreation,
  Id,
} from './shared';

export const protobufPackage = 'sensorData';

export const SENSOR_DATA_PACKAGE_NAME = 'sensorData';

export interface SensorDataServiceClient {
  createSensorData(request: SensorDataCreation): Observable<Empty>;

  getSensorDataById(request: Id): Observable<SensorData>;

  getAllSensorData(request: Empty): Observable<SensorDataArray>;

  getPictureById(request: Id): Observable<Picture>;

  removeSensorDataById(request: Id): Observable<Empty>;
}

export interface SensorDataServiceController {
  createSensorData(
    request: SensorDataCreation,
  ): Promise<Empty> | Observable<Empty> | Empty;

  getSensorDataById(
    request: Id,
  ): Promise<SensorData> | Observable<SensorData> | SensorData;

  getAllSensorData(
    request: Empty,
  ): Promise<SensorDataArray> | Observable<SensorDataArray> | SensorDataArray;

  getPictureById(request: Id): Promise<Picture> | Observable<Picture> | Picture;

  removeSensorDataById(request: Id): Promise<Empty> | Observable<Empty> | Empty;
}

export function SensorDataServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createSensorData',
      'getSensorDataById',
      'getAllSensorData',
      'getPictureById',
      'removeSensorDataById',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('SensorDataService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('SensorDataService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const SENSOR_DATA_SERVICE_NAME = 'SensorDataService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
