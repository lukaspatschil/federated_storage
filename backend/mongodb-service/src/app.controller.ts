import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import {Controller, Logger} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {Observable, Subject} from "rxjs";
import {Empty, PictureCreationById} from "mongodb-service/src/service-types/types/proto/shared";
import mime from "mime-types";
import Any = jasmine.Any;
import {PictureStorageServiceControllerMethods} from "./service-types/types/proto/pictureStorage";
import {Id, PictureData} from "../../service-types/types/proto/shared";

type PictureById = {
  id: number;
};

type Picture = {
  id: number;
  name: string;
};

@Controller()
@PictureStorageServiceControllerMethods()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  @GrpcMethod('MongoDBService', 'createPictureById')
  createPictureById(request: Id): Observable<PictureCreationById> {
    return this.createPictureById(request);
  }

  @GrpcMethod('MongoDBService', 'getPictureById')
  getPictureById(request: Id): Observable<PictureData> {
    return this.getPictureById(request);
  }

  @GrpcMethod('MongoDBService', 'removePictureById')
  removePictureById(request: Id): Observable<Empty> {
    return this.removePictureById(request);
  }


}
