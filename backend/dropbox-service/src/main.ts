import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'pictureStorage',
        protoPath: join(__dirname, '../../proto/pictureStorage.proto'),
        url: 'dropbox-service:5000',
      },
    },
  );
  app.listen();
}

bootstrap();
