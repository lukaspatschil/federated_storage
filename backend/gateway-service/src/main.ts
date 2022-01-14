import { NestFactory } from '@nestjs/core';
import { AmqpLoggerService } from './amqp-logger/amqp-logger.service';
import { GatewayModule } from './gateway.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { RpcExcpetionInterceptor } from './interceptors/rpc-exception.intercepto';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    logger: false,
  });

  app.useGlobalInterceptors(new RpcExcpetionInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Federated Storage Infrastructure for IoT Sensor Data')
    .setDescription(
      'The federated Storage Infrastructure for IoT Sensor Data API description',
    )
    .setVersion('1.0')
    .addTag('Storage')
    .build();
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      disableErrorMessages: false,
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ limit: '1mb', extended: true }));

  app.useLogger(app.get(AmqpLoggerService));

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
