/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { util, configure } from "protobufjs/minimal";
import * as Long from "long";
import { Observable } from "rxjs";

export const protobufPackage = "minio";

export interface PictureById {
  id: number;
}

export interface Picture {
  id: number;
  name: string;
}

export const MINIO_PACKAGE_NAME = "minio";

export interface MinIOServiceClient {
  findOne(request: PictureById): Observable<Picture>;
}

export interface MinIOServiceController {
  findOne(
    request: PictureById
  ): Promise<Picture> | Observable<Picture> | Picture;
}

export function MinIOServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("MinIOService", method)(
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
      GrpcStreamMethod("MinIOService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const MIN_IO_SERVICE_NAME = "MinIOService";

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
