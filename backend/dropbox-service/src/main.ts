import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'dropbox',
        protoPath: join(__dirname, '../proto/dropbox.proto'),
        url: 'dropbox-service:5000',
      },
    },
  );
  app.listen();
}

bootstrap();
