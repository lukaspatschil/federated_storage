import { NestFactory } from '@nestjs/core';
import { AmqpLoggerService } from './amqp-logger/amqp-logger.service';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { RpcExcpetionInterceptor } from './interceptors/rpc-exception.intercepto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
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

  app.useLogger(app.get(AmqpLoggerService));

  await app.listen(3000);
}
bootstrap();
