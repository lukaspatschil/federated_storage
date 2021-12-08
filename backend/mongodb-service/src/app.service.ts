import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Input, InputDocument } from './schemas/input';
import { Connection, Model } from 'mongoose';
import { Observable, Subject } from 'rxjs';
import {
  Empty,
  Id,
  PictureCreationById,
  PictureData,
} from './service-types/types/proto/shared';
import { PictureStorageServiceClient } from './service-types/types/proto/pictureStorage';
import { AppController } from './app.controller';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService implements PictureStorageServiceClient {
  private readonly logger = new Logger(AppController.name);
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Input.name) private inputModel: Model<InputDocument>,
  ) {}

  createPictureById(
    request: Observable<PictureCreationById>,
  ): Observable<Empty> {
    const createdInput = new Subject<Empty>();
    this.logger.log('createPictureById');

    request.subscribe((pictureCreation) => {
      this.inputModel.create(pictureCreation.data, (error) => {
        if (error) {
          this.logger.error('Error through adding a picture with id ');
          throw new RpcException({
            //code: status.INTERNAL,
            message: error.message,
          });
        }
        createdInput.next({});
        createdInput.complete();
        this.logger.log('Successfully added a picture with id ');
      });
    });
    return createdInput.asObservable();
  }

  getPictureById(request: Id): Observable<PictureData> {
    const getInput = new Subject<PictureData>();
    this.inputModel.findById(request.id, (error) => {
      if (error) {
        this.logger.error('Error through getting a picture with id ');
        throw new RpcException({
          //code: status.NOT_FOUND,
          message: error.message,
        });
      }
      getInput.complete();
      this.logger.log('Successfully getting a picture with id ');
    });
    return getInput.asObservable();
  }

  removePictureById(request: Id): Observable<Empty> {
    const removedInput = new Subject<Empty>();
    this.inputModel.remove(request.id, (error) => {
      if (error) {
        this.logger.error('Error through removing the object: ');
        throw new RpcException({
          //code: status.INTERNAL,
          message: error.message,
        });
      } else {
        this.logger.log('Successfully removed the object with id ');
      }
      removedInput.next({});
      removedInput.complete();
    });

    return removedInput.asObservable();
  }
}
