/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { util, configure } from "protobufjs/minimal";
import * as Long from "long";
import { Observable } from "rxjs";

export const protobufPackage = "picture";

export interface PictureById {
  id: number;
}

export interface Picture {
  id: number;
  name: string;
}

export const PICTURE_PACKAGE_NAME = "picture";

export interface PictureServiceClient {
  findOne(request: PictureById): Observable<Picture>;
}

export interface PictureServiceController {
  findOne(
    request: PictureById
  ): Promise<Picture> | Observable<Picture> | Picture;
}

export function PictureServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("PictureService", method)(
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
      GrpcStreamMethod("PictureService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const PICTURE_SERVICE_NAME = "PictureService";

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
