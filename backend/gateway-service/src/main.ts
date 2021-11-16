import { NestFactory } from '@nestjs/core';
import { AmqpLoggerService } from './amqp-logger/amqp-logger.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.useLogger(app.get(AmqpLoggerService));

  await app.listen(3000);
}
bootstrap();
