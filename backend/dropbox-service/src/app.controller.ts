import { Controller } from '@nestjs/common';
import DropboxConfig from '../dropbox-config.json';
import { Dropbox } from 'dropbox';
import { Logger } from '@nestjs/common';
import mime from 'mime-types';
import {
  PictureStorageServiceController,
  PictureStorageServiceControllerMethods,
} from './service-types/types/proto/pictureStorage';
import { Observable, Subject } from 'rxjs';
import {
  Empty,
  Id,
  PictureCreationById,
  PictureData,
} from './service-types/types/proto/shared';

@Controller()
@PictureStorageServiceControllerMethods()
export class AppController implements PictureStorageServiceController {
  private readonly logger = new Logger(AppController.name);

  login(): Dropbox {
    console.log('login function called');
    const dbx = new Dropbox({ accessToken: DropboxConfig.accessToken });
    return dbx;
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
        })
        .catch((uploadErr: Error) => {
          console.log(uploadErr);
          subject.next({});
        });
    });

    return subject.asObservable();
  }

  getPictureById(request: Id): Observable<PictureData> {
    const data = new Subject<PictureData>();

    const dbx = this.login();

    const path =
      DropboxConfig.path + request.id + '.' + mime.extension(request.mimetype);

    dbx
      .filesDownload({ path: path })
      .then((response) => {
        console.log(response);
      })
      .catch((downloadErr: Error) => {
        console.log(downloadErr);
      });

    return data.asObservable();
  }

  removePictureById(request: Id): Promise<Empty> | Observable<Empty> | Empty {
    const subject = new Subject<Empty>();

    const dbx = this.login();

    const path =
      DropboxConfig.path + request.id + '.' + mime.extension(request.mimetype);

    dbx
      .filesDeleteV2({ path: path })
      .then((response: any) => {
        console.log(response);
        subject.next({});
      })
      .catch((deleteErr: Error) => {
        console.log(deleteErr);
        subject.next({});
      });
    return subject;
  }
}
