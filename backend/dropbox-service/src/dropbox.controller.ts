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
import { DropboxService } from './dropbox.service';

@Controller()
@PictureStorageServiceControllerMethods()
export class DropboxController
  implements PictureStorageServiceController
{
  private readonly logger = new Logger(DropboxController.name);

  constructor(private readonly dropboxService: DropboxService) {}

  createPictureById(picture: PictureCreationById) {
    return this.dropboxService.createPictureById(picture)
  }

  async getPictureById(request: IdWithMimetype) {
    return this.dropboxService.getPictureById(request)
  }

  removePictureById(request: IdWithMimetype) {
   return this.dropboxService.removePictureById(request)
  }
}
