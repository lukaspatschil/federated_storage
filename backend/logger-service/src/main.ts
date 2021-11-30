import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const URL = process.env.RABBITMQ_URL;
  const PORT = process.env.RABBITMQ_PORT;
  const USERNAME = process.env.RABBITMQ_USERNAME;
  const PASSWORD = process.env.RABBITMQ_PASSWORD;

  if (!PORT || !USERNAME || !PASSWORD || !URL) {
    throw new Error('Port, username or password for Rabbit MQ is not set!');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USERNAME}:${PASSWORD}@${URL}:${PORT}`],
        queue: 'logger_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.listen();
}
bootstrap();
