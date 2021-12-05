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
import path from 'path';

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

    console.log('createPictureById');

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
          console.log(response);
          subject.next({});
          subject.complete();
        })
        .catch((uploadErr: Error) => {
          // TODO
          console.log(uploadErr);
          subject.error(uploadErr.message);
          subject.complete();
        });
    });

    return subject.asObservable();
  }

  getPictureById(request: IdWithMimetype): Observable<PictureData> {
    const data = new Subject<PictureData>();
    let returnData: PictureData;

    console.log('getPictureById');

    const dbx = this.login();

    const path =
      DropboxConfig.path + request.id + '.' + mime.extension(request.mimetype);

    dbx
      .filesDownload({ path: path })
      .then((response) => {
        console.log(response);
        returnData = {
          data: (<any>response.result).fileBinary,
        };
        data.next(returnData);
        data.complete();
      })
      .catch((downloadErr: Error) => {
        // TODO
        console.log(downloadErr);
        data.error(downloadErr.message);
        data.complete();
      });

    return data.asObservable();
  }

  removePictureById(
    request: IdWithMimetype,
  ): Promise<Empty> | Observable<Empty> | Empty {
    const subject = new Subject<Empty>();

    console.log('removePictureById');

    const dbx = this.login();

    const path =
      DropboxConfig.path + request.id + '.' + mime.extension(request.mimetype);

    dbx
      .filesDeleteV2({ path: path })
      .then((response: any) => {
        console.log(response);
        subject.next({});
        subject.complete();
      })
      .catch((deleteErr: Error) => {
        // TODO
        console.log(deleteErr);
        subject.error(deleteErr.message);
        subject.complete();
      });
    return subject;
  }

  /*getAllFilesInPath(): Subject<Empty> {
    const subject = new Subject<Empty>();

    const dbx = this.login();

    dbx
      .filesListFolder({ path: DropboxConfig.path })
      .then((response) => {
        console.log(response);
        subject.next(response.result.entries.length);
        subject.complete();
      })
      .catch((error: Error) => {
        console.log(error);
        subject.error(error.message);
        subject.complete();
      });

    return subject;
  }

  checkIfFileExists(tempPath: string): Subject<Empty> {
    const subject = new Subject<Empty>();

    const dbx = this.login();

    dbx.filesListFolder({ path: path.dirname(tempPath) }).then((result) => {});

    return subject;
  }*/
}
