import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import DropboxConfig from '../dropbox-config.json';
import { Dropbox, files } from 'dropbox';

type PictureById = {
  id: string;
};

export type Picture = {
  id: string;
  name: string;
  data: string;
};

@Controller()
export class AppController {
  @GrpcMethod('DropboxService', 'FindOne')
  findOne(data: PictureById): Picture {
    console.log('FindOne' + data);
    const items = [
      { id: '1', name: 'John', data: 'Base64' },
      { id: '2', name: 'Doe', data: 'Base64' },
    ];

    return items.find(({ id }) => id === data.id);
  }

  @GrpcMethod('DropboxService', 'CreateOne')
  createOne(picture: Picture) {
    console.log('CreateOne: ' + JSON.stringify(picture));
    const dbx = this.login();
    dbx
      .filesUpload({ path: picture.id, contents: picture.data })
      .then((response: any) => {
        console.log(response);
      })
      .catch((uploadErr: Error) => {
        console.log(uploadErr);
      });
  }

  login(): Dropbox {
    console.log('login function called');
    const dbx = new Dropbox({ accessToken: DropboxConfig.accessToken });
    return dbx;
  }
}
