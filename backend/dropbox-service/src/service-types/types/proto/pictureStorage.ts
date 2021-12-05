/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import {
  Empty,
  PictureData,
  IdWithMimetype,
  PictureCreationById,
} from "./shared";

export const protobufPackage = "pictureStorage";

export const PICTURE_STORAGE_PACKAGE_NAME = "pictureStorage";

export interface PictureStorageServiceClient {
  createPictureById(
    request: Observable<PictureCreationById>
  ): Observable<Empty>;

  getPictureById(request: IdWithMimetype): Observable<PictureData>;

  removePictureById(request: IdWithMimetype): Observable<Empty>;
}

export interface PictureStorageServiceController {
  createPictureById(
    request: Observable<PictureCreationById>
  ): Promise<Empty> | Observable<Empty> | Empty;

  getPictureById(request: IdWithMimetype): Observable<PictureData>;

  removePictureById(
    request: IdWithMimetype
  ): Promise<Empty> | Observable<Empty> | Empty;
}

export function PictureStorageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getPictureById", "removePictureById"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("PictureStorageService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = ["createPictureById"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod("PictureStorageService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const PICTURE_STORAGE_SERVICE_NAME = "PictureStorageService";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
