import { ClientsModule, Transport } from '@nestjs/microservices';

import { SensordataController } from './sensordata.controller';
import { SensordataService } from './sensordata.service';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { AmqpLoggerModule } from './amqp-logger/amqp-logger.module';

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
          package: 'sensorDataStorage',
          protoPath: join(__dirname, '../../proto/sensorDataStorage.proto'),
          url: 'mongodb-service:5000',
        },
      },
    ]),
    AmqpLoggerModule,
  ],
  controllers: [SensordataController],
  providers: [SensordataService],
})
export class SensordataModule {}
