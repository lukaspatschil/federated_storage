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
    picture: PictureCreationById,
  ): Promise<Empty> | Observable<Empty> | Empty {
    this.logger.log('createPictureById');
    return new Promise((resolve) => {
      const path =
        this.configService.get('DROPBOX_PATH') +
        picture.id +
        '.' +
        mime.extension(picture.mimetype);

      this.logger.log("DropboxService createPictureById(): send request to dropbox")

      this.dbx
        .filesUpload({
          path: path,
          contents: picture.data,
          autorename: false,
          mode: { ".tag": "overwrite" },
          mute: true,
          strict_conflict: false
        })
        .then((response: any) => {
          this.logger.log("DropboxService createPictureById(): request to dropbox sent sucessfully")
          this.logger.log(response);
          resolve({});
        })
        .catch((uploadErr: Error) => {
          this.logger.error("DropboxService createPictureByID: " + uploadErr)
          throw new RpcException({
            code: status.INTERNAL,
            message: uploadErr.message,
          });
        });
    });
  }

  async getPictureById(request: IdWithMimetype) {
    this.logger.log('getPictureById');
    const path =
      this.configService.get('DROPBOX_PATH') +
      request.id +
      '.' +
      mime.extension(request.mimetype);

    try {
      const response = await this.dbx.filesDownload({ path: path });
      this.logger.log(response);
      return { data: (<any>response.result).fileBinary };
    } catch (e) {
      this.logger.error(JSON.stringify(e));

      // TODO: maybe make more specific
      if (e?.status && e.status === 409) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: e.message,
        });
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: 'Dropbox Response Error',
      });
    }
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
