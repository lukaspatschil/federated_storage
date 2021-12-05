import { Controller, Logger } from '@nestjs/common';
import DropboxConfig from '../dropbox-config.json';
import { Dropbox } from 'dropbox';
import mime from 'mime-types';
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

@Controller()
@PictureStorageServiceControllerMethods()
export class AppController implements PictureStorageServiceController {
  private readonly logger = new Logger(AppController.name);

  login(): Dropbox {
    this.logger.log('login function called');
    return new Dropbox({ accessToken: DropboxConfig.accessToken });
  }

  createPictureById(
    request: Observable<PictureCreationById>,
  ): Promise<Empty> | Observable<Empty> | Empty {
    const subject = new Subject<Empty>();

    this.logger.log('createPictureById');

    const dbx = this.login();

    request.subscribe((picture) => {
      const path =
        DropboxConfig.path +
        picture.id +
        '.' +
        mime.extension(picture.mimetype);

      dbx
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
            code: status.NOT_FOUND,
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

    const dbx = this.login();

    const path =
      DropboxConfig.path + request.id + '.' + mime.extension(request.mimetype);

    dbx
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
        // TODO
        this.logger.log(downloadErr);
        data.error(downloadErr.message);
        data.complete();
      });

    return data.asObservable();
  }

  removePictureById(
    request: IdWithMimetype,
  ): Promise<Empty> | Observable<Empty> | Empty {
    const subject = new Subject<Empty>();

    this.logger.log('removePictureById');

    const dbx = this.login();

    const path =
      DropboxConfig.path + request.id + '.' + mime.extension(request.mimetype);

    dbx
      .filesDeleteV2({ path: path })
      .then((response: any) => {
        this.logger.log(response);
        subject.next({});
        subject.complete();
      })
      .catch((deleteErr: Error) => {
        // TODO
        this.logger.log(deleteErr);
        subject.error(deleteErr.message);
        subject.complete();
      });
    return subject;
  }
}
