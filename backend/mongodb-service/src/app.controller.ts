import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {Observable, Subject} from "rxjs";
import {Empty, PictureCreationById} from "mongodb-service/src/service-types/types/proto/shared";
import mime from "mime-types";

type PictureById = {
  id: number;
};

type Picture = {
  id: number;
  name: string;
};

@Controller()
export class AppController {
  @GrpcMethod('MongoDBService', 'FindOne')
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
  ): Observable<Empty> {
    const subject = new Subject<Empty>();
    console.log('createPictureById');

    request.subscribe((picture) => {
      const path =
          MongoDb.path +
          picture.id +
          '.' +
          mime.extension(picture.mimetype);

      dbx
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

  getPictureById(){}

  removePictureById() {

  }


}
