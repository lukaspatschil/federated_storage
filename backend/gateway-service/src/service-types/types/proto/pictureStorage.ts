/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Observable } from 'rxjs';
import {
  Empty,
  PictureData,
  PictureCreationById,
  IdWithMimetype,
} from './shared';

export const protobufPackage = 'pictureStorage';

export const PICTURE_STORAGE_PACKAGE_NAME = 'pictureStorage';

export interface PictureStorageServiceClient {
  createPictureById(request: PictureCreationById): Observable<Empty>;

  getPictureById(request: IdWithMimetype): Observable<PictureData>;

  removePictureById(request: IdWithMimetype): Observable<Empty>;
}

export interface PictureStorageServiceController {
  createPictureById(
    request: PictureCreationById,
  ): Promise<Empty> | Observable<Empty> | Empty;

  getPictureById(
    request: IdWithMimetype,
  ): Promise<PictureData> | Observable<PictureData> | PictureData;

  removePictureById(
    request: IdWithMimetype,
  ): Promise<Empty> | Observable<Empty> | Empty;
}

export function PictureStorageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createPictureById',
      'getPictureById',
      'removePictureById',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('PictureStorageService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('PictureStorageService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const PICTURE_STORAGE_SERVICE_NAME = 'PictureStorageService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
