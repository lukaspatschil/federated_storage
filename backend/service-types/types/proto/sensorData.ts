/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { util, configure } from "protobufjs/minimal";
import * as Long from "long";
import { Observable } from "rxjs";
import {
  SensorData,
  SensorDataArray,
  Picture,
  Empty,
  Id,
  SensorDataCreation,
} from "./shared";

export const protobufPackage = "sensorData";

export const SENSOR_DATA_PACKAGE_NAME = "sensorData";

export interface SensorDataServiceClient {
  createSensorData(
    request: Observable<SensorDataCreation>
  ): Observable<SensorData>;

  getSensorDataById(request: Id): Observable<SensorData>;

  getAllSensorData(request: Empty): Observable<SensorDataArray>;

  getPictureById(request: Id): Observable<Picture>;

  removeSensorDataById(request: Id): Observable<Empty>;
}

export interface SensorDataServiceController {
  createSensorData(
    request: Observable<SensorDataCreation>
  ): Promise<SensorData> | Observable<SensorData> | SensorData;

  getSensorDataById(
    request: Id
  ): Promise<SensorData> | Observable<SensorData> | SensorData;

  getAllSensorData(
    request: Empty
  ): Promise<SensorDataArray> | Observable<SensorDataArray> | SensorDataArray;

  getPictureById(request: Id): Observable<Picture>;

  removeSensorDataById(request: Id): Promise<Empty> | Observable<Empty> | Empty;
}

export function SensorDataServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getSensorDataById",
      "getAllSensorData",
      "getPictureById",
      "removeSensorDataById",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("SensorDataService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = ["createSensorData"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod("SensorDataService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const SENSOR_DATA_SERVICE_NAME = "SensorDataService";

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
