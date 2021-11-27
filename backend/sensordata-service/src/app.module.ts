import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MINIO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'pictureStorage',
          protoPath: join(__dirname, '../../proto/pictureStorage.proto'),
          url: 'minio-service:5000',
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'DROPBOX_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'pictureStorage',
          protoPath: join(__dirname, '../../proto/pictureStorage.proto'),
          url: 'dropbox-service:5000',
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'MONGODB_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'mongodb',
          protoPath: join(__dirname, '../../proto/mongodb.proto'),
          url: 'mongodb-service:5000',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
