/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { util, configure } from "protobufjs/minimal";
import * as Long from "long";
import { Observable } from "rxjs";
import {
  SensorData,
  SensorDataArray,
  Empty,
  PictureWithoutData,
  PictureWithoutDataArray,
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

  getAllPicturesByPictureID(request: Id): Observable<PictureWithoutDataArray>;
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

  getAllPicturesByPictureID(
    request: Id
  ):
    | Promise<PictureWithoutDataArray>
    | Observable<PictureWithoutDataArray>
    | PictureWithoutDataArray;
}

export function SensorDataStorageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createSensorData",
      "getSensorDataById",
      "getAllSensorData",
      "removeSensorDataById",
      "getPictureWithoutDataById",
      "getAllPicturesByPictureID",
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

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
