import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AmqpLoggerService } from './amqp-logger/amqp-logger.service';
import { MongoDBModule } from './mongodb.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MongoDBModule,
    {
      logger: false,
      transport: Transport.GRPC,
      options: {
        package: 'mongodb',
        protoPath: join(__dirname, '../../proto/mongodb.proto'),
        url: 'mongodb-service:5000',
      },
    },
  );
  // app.useLogger(app.get(AmqpLoggerService));

  app.listen();
}

bootstrap();
