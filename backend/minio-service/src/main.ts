import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PICTURE_STORAGE_PACKAGE_NAME } from './service-types/types/proto/pictureStorage';
import { AmqpLoggerService } from './amqp-logger/amqp-logger.service';
import { MinioModule } from './minio.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MinioModule,
    {
      transport: Transport.GRPC,
      options: {
        package: PICTURE_STORAGE_PACKAGE_NAME,
        protoPath: join(__dirname, '../../proto/pictureStorage.proto'),
        url: 'minio-service:5000',
      },
    },
  );
  app.useLogger(app.get(AmqpLoggerService));

  app.listen();
}

bootstrap();
