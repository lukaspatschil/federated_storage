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
  ): Promise<Empty> | Observable<Empty> | Empty {
    const createdInput = new Subject<Empty>();
    this.logger.log('createPictureById');

    request.subscribe((pictureCreation) => {
      this.inputModel.init(pictureCreation.data, (error) => {
        if (error) {
          this.logger.error(
            'Error through adding a picture with id ' + createdInput.id,
          );
          throw new RpcException({
            code: status.INTERNAL,
            message: error.message,
          });
        }
        createdInput.next({});
        createdInput.complete();
        this.logger.log(
          'Successfully added a picture with id ' + createdInput.id,
        );
      });
    });
    return createdInput.asObservable();
  }

  getPictureById(request: Id): Observable<PictureData> {
    const getInput = new Subject<Empty>();
    this.inputModel.findById(request.id, (error) => {
      if (error) {
        this.logger.error(
          'Error through getting a picture with id ' + getInput.id,
        );
        throw new RpcException({
          code: status.INTERNAL,
          message: error.message,
        });
      }
      getInput.next({});
      getInput.complete();
      this.logger.log('Successfully getting a picture with id ' + getInput.id);
    });
    return getInput.asObservable();
  }

  removePictureById(request: Id): Observable<Empty> {
    const removedInput = new Subject<Empty>();
    this.inputModel.remove(request.id, (error) => {
      if (error) {
        this.logger.error(
          'Error through removing the object: ' + error.message,
        );
        throw new RpcException({
          code: status.INTERNAL,
          message: error.message,
        });
      } else {
        this.logger.log(
          'Successfully removed the object with id ' + request.id,
        );
      }
      removedInput.next({});
      removedInput.complete();
    });

    return removedInput.asObservable();
  }
}
