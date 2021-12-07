import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { Observable, Subject } from 'rxjs';
import {
  PictureCreationById,
  Empty,
  Id,
  PictureData,
} from './service-types/types/proto/shared';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);

  private minioClient: Minio.Client;
  private readonly bucketName = 'pictures';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.minioClient = this.connectToMinio();
    try {
      await this.createNewBucket();
    } catch (err) {
      throw new RpcException({
        code: status.INTERNAL,
        message: err.message,
      });
    }
  }

  getPictureById(request: Id): Observable<PictureData> {
    const pictureSubject = new Subject<PictureData>();
    const bufs = [];
    this.minioClient.getObject(
      this.bucketName,
      request.id,
      (err, dataStream) => {
        if (err) {
          this.logger.error('Unable to get object: ' + err.message);
          throw new RpcException({
            code: status.NOT_FOUND,
            message: err.message,
          });
        }
        dataStream.on('data', (chunk) => {
          bufs.push(chunk);
        });
        dataStream.on('end', () => {
          this.logger.log(`Data of picture ${request.id} loaded completely.`);
          const picture: PictureData = {
            data: Buffer.concat(bufs),
          };
          pictureSubject.next(picture);
          pictureSubject.complete();
        });
        dataStream.on('error', (err) => {
          this.logger.error(err);
          throw new RpcException({
            code: status.INTERNAL,
            message: err.message,
          });
        });
      },
    );
    return pictureSubject.asObservable();
  }

  removePictureById(request: Id): Observable<Empty> {
    const removeSubject = new Subject<Empty>();
    this.minioClient.removeObject(this.bucketName, request.id, (err) => {
      if (err) {
        this.logger.error('Unable to remove object: ' + err.message);
        throw new RpcException({
          code: status.INTERNAL,
          message: err.message,
        });
      } else {
        this.logger.log('Removed the object ' + request.id);
      }
      removeSubject.next({});
      removeSubject.complete();
    });
    return removeSubject.asObservable();
  }

  createPictureById(
    request: Observable<PictureCreationById>,
  ): Observable<Empty> {
    const pictureSubject = new Subject<Empty>();
    request.subscribe((pictureCreation) => {
      this.minioClient.putObject(
        this.bucketName,
        pictureCreation.id,
        pictureCreation.data,
        (err) => {
          if (err) {
            this.logger.error(
              'Error when adding picture ' + pictureCreation.id,
            );
            throw new RpcException({
              code: status.INTERNAL,
              message: err.message,
            });
          }
          pictureSubject.next({});
          pictureSubject.complete();
          this.logger.log('Successfully added picture ' + pictureCreation.id);
        },
      );
    });
    return pictureSubject.asObservable();
  }

  private connectToMinio(): Minio.Client {
    this.logger.log('Connecting to Minio');
    const minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT'),
      port: Number(this.configService.get<string>('MINIO_PORT')),
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESSKEY'),
      secretKey: this.configService.get<string>('MINIO_SECRETKEY'),
    });
    return minioClient;
  }

  private createNewBucket(): Promise<void> {
    const region = this.configService.get<string>('MINIO_REGION');
    return new Promise((resolve, reject) => {
      this.minioClient.makeBucket(this.bucketName, region, (err) => {
        if (err) {
          if ((err as any).code === 'BucketAlreadyOwnedByYou') {
            this.logger.warn(err.message);
          } else {
            this.logger.error('Error creating bucket. ' + err.message);
            reject(err);
          }
        } else {
          this.logger.log(
            this.bucketName + ' created successfully in ' + region,
          );
        }
        resolve();
      });
    });
  }
}
