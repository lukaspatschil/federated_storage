import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import {Controller, Logger} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {Observable, Subject} from "rxjs";
import {Empty, PictureCreationById} from "mongodb-service/src/service-types/types/proto/shared";
import mime from "mime-types";
import Any = jasmine.Any;
import {PictureStorageServiceControllerMethods} from "./service-types/types/proto/pictureStorage";

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
  findOne(
    data: PictureById,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Picture {
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];

    return items.find(({ id }) => id === data.id);
  }

  createPictureById(
    request: Observable<PictureCreationById>,
  ): Promise<Empty> | Observable<Empty> | Empty {
    const subject = new Subject<Empty>();
    console.log('createPictureById');
    request.subscribe((picture) => {

      const path =
          DropboxConfig.path +
          picture.id +
          '.' +
          mime.extension(picture.mimetype);

      .filesUpload({
        path: path,
        contents: picture.data,
      })
          .then((response: any) => {
            console.log(response);
            subject.next({});
            subject.complete();
          })
          .catch((uploadErr: Error) => {
            console.log(uploadErr);
            subject.next({});
          });
      });
    return request;
  }

  getPictureById(){}

  removePictureById() {

  }


}
