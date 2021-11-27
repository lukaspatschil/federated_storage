/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { util, configure } from "protobufjs/minimal";
import * as Long from "long";
import { Observable } from "rxjs";

export const protobufPackage = "pictureStorage";

export interface Id {
  id: string;
}

export interface CreatePictureEntity {
  id: string;
  mimeType: string;
  data: Buffer;
}

export interface Data {
  data: Buffer;
}

/** we send an empty message because we just want the http status code */
export interface Res {}

export const PICTURE_STORAGE_PACKAGE_NAME = "pictureStorage";

export interface PictureStorageServiceClient {
  getPictureById(request: Id): Observable<Data>;

  createPictureById(request: Observable<CreatePictureEntity>): Observable<Res>;

  removePictureById(request: Id): Observable<Res>;
}

export interface PictureStorageServiceController {
  getPictureById(request: Id): Observable<Data>;

  createPictureById(
    request: Observable<CreatePictureEntity>
  ): Promise<Res> | Observable<Res> | Res;

  removePictureById(request: Id): Promise<Res> | Observable<Res> | Res;
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

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
