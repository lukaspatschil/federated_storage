import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AmqpLoggerService } from './amqp-logger/amqp-logger.service';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { RpcExceptionInterceptor } from './interceptors/rpc-exception.intercepto';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'sensorData',
        protoPath: join(__dirname, '../../proto/sensorData.proto'),
        url: 'sensordata-service:5000',
      },
    },
  );

  app.useGlobalInterceptors(new RpcExceptionInterceptor());

  app.useLogger(app.get(AmqpLoggerService));
  app.listen();
}

bootstrap();
