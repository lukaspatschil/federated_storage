import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AmqpLoggerService } from './amqp-logger/amqp-logger.service';
import { MongoDBModule } from './mongodb.module';
import { SENSOR_DATA_STORAGE_PACKAGE_NAME } from './service-types/types/proto/sensorDataStorage';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MongoDBModule,
    {
      transport: Transport.GRPC,
      options: {
        package: SENSOR_DATA_STORAGE_PACKAGE_NAME,
        protoPath: join(__dirname, '../../proto/sensorDataStorage.proto'),
        url: 'mongodb-service:5000',
      },
    },
  );
  app.useLogger(app.get(AmqpLoggerService));

  app.listen();
}

bootstrap();
