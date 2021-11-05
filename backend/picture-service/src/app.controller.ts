import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, Inject } from '@nestjs/common';
import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DropboxServiceClient } from './interfaces/dropbox.interface';
import { MinIOServiceClient } from './interfaces/minio.interface';
import { MongoDBServiceClient } from './interfaces/mongodb.interface';

type PictureById = {
  id: number;
};

type Picture = {
  id: number;
  name: string;
};

@Controller()
export class AppController {
  private minIOService: MinIOServiceClient;
  private dropboxService: DropboxServiceClient;
  private mongodbService: MongoDBServiceClient;

  constructor(
    @Inject('MINIO_PACKAGE') private minioClient: ClientGrpc,
    @Inject('DROPBOX_PACKAGE') private dropboxClient: ClientGrpc,
    @Inject('MONGODB_PACKAGE') private mongodbClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.minIOService =
      this.minioClient.getService<MinIOServiceClient>('MinIOService');

    this.dropboxService =
      this.dropboxClient.getService<DropboxServiceClient>('DropboxService');

    this.mongodbService =
      this.mongodbClient.getService<MongoDBServiceClient>('MongoDBService');
  }

  @GrpcMethod('PictureService', 'FindOne')
  async findOne(
    data: PictureById,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<Observable<Picture>> {
    this.dropboxService
      .findOne(data)
      .subscribe(({ id }) => console.log(`The dropbox gets image with ${id}`));

    this.mongodbService
      .findOne(data)
      .subscribe(({ id }) => console.log(`The mongo says ${id}`));

    return this.minIOService.findOne(data);
  }
}
