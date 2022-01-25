import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { DropboxModule } from './dropbox.module';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AmqpLoggerService } from './amqp-logger/amqp-logger.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DropboxModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'pictureStorage',
        protoPath: join(__dirname, '../../proto/pictureStorage.proto'),
        url: 'dropbox-service:5000',
      },
    },
  );
  app.useLogger(app.get(AmqpLoggerService));

  app.listen();
}

bootstrap();
