import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AmqpLoggerService } from './amqp-logger/amqp-logger.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      logger: false,
      transport: Transport.GRPC,
      options: {
        package: 'minio',
        protoPath: join(__dirname, '../../proto/minio.proto'),
        url: 'minio-service:5000',
      },
    },
  );
  app.useLogger(app.get(AmqpLoggerService));

  app.listen();
}

bootstrap();
