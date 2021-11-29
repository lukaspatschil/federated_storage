import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import DropboxConfig from '../dropbox-config.json';
import { Dropbox } from 'dropbox';
import { Logger } from '@nestjs/common';
import mime from 'mime-types';

type PictureById = {
  id: string;
};

export type CreatePictureEntity = {
  id: string;
  mimetype: string;
  data: string;
};

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @GrpcMethod('PictureStorageService', 'GetPictureById')
  findOne(data: PictureById): CreatePictureEntity {
    console.log('FindOne' + data);
    /*const items = [
      { id: '1', name: 'John', data: 'Base64' },
      { id: '2', name: 'Doe', data: 'Base64' },
    ];*/
    return null;

    /*return items.find(({ id }) => id === data.id);*/
  }

  @GrpcMethod('PictureStorageService', 'CreatePictureById')
  createOne(pic: CreatePictureEntity): CreatePictureEntity {
    console.log('CreateOne: ' + JSON.stringify(pic));
    const dbx = this.login();

    //const blob = base64StringToBlob(pic.data, pic.mimetype);

    const blob = Buffer.from(pic.data, 'base64').toString('binary');

    let path;
    if (pic.mimetype == 'image/jpeg') {
      path = DropboxConfig.path + pic.id + '.jpeg';
    } else if (pic.mimetype == 'image/png') {
      path = DropboxConfig.path + pic.id + '.png';
    } else {
      throw new NoCorrectMimeTypeException('Mimetype not suitable');
    }

    const extension = mime.extension(pic.mimetype);

    dbx
      .filesUpload({
        path: path,
        contents: blob,
      })
      .then((response: any) => {
        console.log(response);
        this.logger.log(response);
      })
      .catch((uploadErr: Error) => {
        console.log(uploadErr);
        this.logger.log(uploadErr);
      });
    return null;
  }

  login(): Dropbox {
    console.log('login function called');
    const dbx = new Dropbox({ accessToken: DropboxConfig.accessToken });
    return dbx;
  }
}
