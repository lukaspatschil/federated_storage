import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import * as mime from 'mime-types';
import {
  PictureStorageServiceController,
  PictureStorageServiceControllerMethods,
} from './service-types/types/proto/pictureStorage';
import { Observable, Subject } from 'rxjs';
import {
  Empty,
  IdWithMimetype,
  PictureCreationById,
  PictureData,
} from './service-types/types/proto/shared';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';

@Controller()
@PictureStorageServiceControllerMethods()
export class AppController
  implements PictureStorageServiceController, OnModuleInit
{
  private readonly logger = new Logger(AppController.name);
  private dbx: Dropbox;

  onModuleInit() {
    this.dbx = new Dropbox({
      accessToken: this.configService.get('DROPBOX_ACCESSTOKEN'),
    });
  }

  constructor(private readonly configService: ConfigService) {}

  createPictureById(
    request: Observable<PictureCreationById>,
  ): Promise<Empty> | Observable<Empty> | Empty {
    const subject = new Subject<Empty>();

    this.logger.log('createPictureById');

    request.subscribe((picture) => {
      const path =
        this.configService.get('DROPBOX_PATH') +
        picture.id +
        '.' +
        mime.extension(picture.mimetype);

      this.dbx
        .filesUpload({
          path: path,
          contents: picture.data,
        })
        .then((response: any) => {
          this.logger.log(response);
          subject.next({});
          subject.complete();
        })
        .catch((uploadErr: Error) => {
          throw new RpcException({
            code: status.INTERNAL,
            message: uploadErr.message,
          });
        });
    });

    return subject.asObservable();
  }

  getPictureById(request: IdWithMimetype): Observable<PictureData> {
    const data = new Subject<PictureData>();
    let returnData: PictureData;

    this.logger.log('getPictureById');

    const path =
      this.configService.get('DROPBOX_PATH') +
      request.id +
      '.' +
      mime.extension(request.mimetype);

    this.dbx
      .filesDownload({ path: path })
      .then((response) => {
        this.logger.log(response);
        returnData = {
          data: (<any>response.result).fileBinary,
        };
        data.next(returnData);
        data.complete();
      })
      .catch((downloadErr: Error) => {
        this.logger.log(downloadErr);

        throw new RpcException({
          code: status.NOT_FOUND,
          message: downloadErr.message,
        });
      });

    return data.asObservable();
  }

  removePictureById(
    request: IdWithMimetype,
  ): Promise<Empty> | Observable<Empty> | Empty {
    const subject = new Subject<Empty>();

    this.logger.log('removePictureById');

    const path =
      this.configService.get('DROPBOX_PATH') +
      request.id +
      '.' +
      mime.extension(request.mimetype);

    this.dbx
      .filesDeleteV2({ path: path })
      .then((response: any) => {
        this.logger.log(response);
        subject.next({});
        subject.complete();
      })
      .catch((deleteErr: Error) => {
        this.logger.log(deleteErr);

        throw new RpcException({
          code: status.NOT_FOUND,
          message: deleteErr.message,
        });
      });
    return subject;
  }
}
