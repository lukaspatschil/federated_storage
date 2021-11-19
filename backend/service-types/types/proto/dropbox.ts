/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { util, configure } from "protobufjs/minimal";
import * as Long from "long";
import { Observable } from "rxjs";

export const protobufPackage = "dropbox";

export interface PictureById {
  id: number;
}

export interface Picture {
  id: number;
  name: string;
}

export const DROPBOX_PACKAGE_NAME = "dropbox";

export interface DropboxServiceClient {
  findOne(request: PictureById): Observable<Picture>;
}

export interface DropboxServiceController {
  findOne(
    request: PictureById
  ): Promise<Picture> | Observable<Picture> | Picture;
}

export function DropboxServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("DropboxService", method)(
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
      GrpcStreamMethod("DropboxService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const DROPBOX_SERVICE_NAME = "DropboxService";

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
