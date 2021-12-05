/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import {
  Empty,
  SensorData,
  SensorDataArray,
  Picture,
  Id,
  SensorDataCreation,
} from "./shared";

export const protobufPackage = "sensorData";

export const SENSOR_DATA_PACKAGE_NAME = "sensorData";

export interface SensorDataServiceClient {
  createSensorData(request: Observable<SensorDataCreation>): Observable<Empty>;

  getSensorDataById(request: Id): Observable<SensorData>;

  getAllSensorData(request: Empty): Observable<SensorDataArray>;

  getPictureById(request: Id): Observable<Picture>;

  removeSensorDataById(request: Id): Observable<Empty>;
}

export interface SensorDataServiceController {
  createSensorData(
    request: Observable<SensorDataCreation>
  ): Promise<Empty> | Observable<Empty> | Empty;

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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
