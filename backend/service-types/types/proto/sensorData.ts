/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { util, configure } from "protobufjs/minimal";
import * as Long from "long";
import { Observable } from "rxjs";

export const protobufPackage = "sensorData";

export interface Empty {}

export interface Id {
  id: string;
}

export interface Location {
  longitude: number;
  latitude: number;
}

export interface PictureCreation {
  mimetype: string;
  data: Buffer;
}

export interface PictureWithoutData {
  id: string;
  createdAt: string;
}

export interface Picture {
  id: string;
  mimetype: string;
  data: Buffer;
  createdAt: string;
}

export interface MetaDataCreation {
  name: string;
  placeIdent: string;
  seqId: string;
  datetime: string;
  frameNum: number;
  seqNumFrames: number;
  filename: string;
  deviceID: string;
  location: Location | undefined;
}

export interface MetaData {
  name: string;
  placeIdent: string;
  seqId: string;
  datetime: string;
  frameNum: number;
  seqNumFrames: number;
  filename: string;
  deviceID: string;
  location: Location | undefined;
  tags: string[];
}

export interface SensorDataCreation {
  picture: PictureCreation | undefined;
  metadata: MetaDataCreation | undefined;
}

export interface SensorData {
  id: string;
  pictures: PictureWithoutData[];
  metadata: MetaData | undefined;
}

export interface SensorDataArray {
  sensorData: SensorData[];
}

export const SENSOR_DATA_PACKAGE_NAME = "sensorData";

export interface SensorDataServiceClient {
  createSensorData(request: SensorDataCreation): Observable<Empty>;

  getSensorDataById(request: Id): Observable<SensorData>;

  getAllSensorData(request: Empty): Observable<SensorDataArray>;

  getPictureById(request: Id): Observable<Picture>;

  removeSensorDataById(request: Id): Observable<Empty>;
}

export interface SensorDataServiceController {
  createSensorData(
    request: SensorDataCreation
  ): Promise<Empty> | Observable<Empty> | Empty;

  getSensorDataById(
    request: Id
  ): Promise<SensorData> | Observable<SensorData> | SensorData;

  getAllSensorData(
    request: Empty
  ): Promise<SensorDataArray> | Observable<SensorDataArray> | SensorDataArray;

  getPictureById(request: Id): Promise<Picture> | Observable<Picture> | Picture;

  removeSensorDataById(request: Id): Promise<Empty> | Observable<Empty> | Empty;
}

export function SensorDataServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createSensorData",
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
    const grpcStreamMethods: string[] = [];
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
