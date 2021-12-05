/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import {
  SensorData,
  SensorDataArray,
  Empty,
  PictureWithoutData,
  SensorDataCreationWithoutPictureData,
  Id,
} from "./shared";

export const protobufPackage = "sensorDataStorage";

export const SENSOR_DATA_STORAGE_PACKAGE_NAME = "sensorDataStorage";

export interface SensorDataStorageServiceClient {
  createSensorData(
    request: SensorDataCreationWithoutPictureData
  ): Observable<SensorData>;

  getSensorDataById(request: Id): Observable<SensorData>;

  getAllSensorData(request: Empty): Observable<SensorDataArray>;

  removeSensorDataById(request: Id): Observable<Empty>;

  getPictureWithoutDataById(request: Id): Observable<PictureWithoutData>;
}

export interface SensorDataStorageServiceController {
  createSensorData(
    request: SensorDataCreationWithoutPictureData
  ): Promise<SensorData> | Observable<SensorData> | SensorData;

  getSensorDataById(
    request: Id
  ): Promise<SensorData> | Observable<SensorData> | SensorData;

  getAllSensorData(
    request: Empty
  ): Promise<SensorDataArray> | Observable<SensorDataArray> | SensorDataArray;

  removeSensorDataById(request: Id): Promise<Empty> | Observable<Empty> | Empty;

  getPictureWithoutDataById(
    request: Id
  ):
    | Promise<PictureWithoutData>
    | Observable<PictureWithoutData>
    | PictureWithoutData;
}

export function SensorDataStorageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createSensorData",
      "getSensorDataById",
      "getAllSensorData",
      "removeSensorDataById",
      "getPictureWithoutDataById",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("SensorDataStorageService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod("SensorDataStorageService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const SENSOR_DATA_STORAGE_SERVICE_NAME = "SensorDataStorageService";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
