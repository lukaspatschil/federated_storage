import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AmqpLoggerService } from './amqp-logger/amqp-logger.service';
import { SensordataModule } from './sensordata.module';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { ExceptionInterceptor } from './interceptors/exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SensordataModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'sensorData',
        protoPath: join(__dirname, '../../proto/sensorData.proto'),
        url: 'sensordata-service:5000',
      },
    },
  );

  app.useGlobalInterceptors(new ExceptionInterceptor());

  app.useLogger(app.get(AmqpLoggerService));
  app.listen();
}

bootstrap();
