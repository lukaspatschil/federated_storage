import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { AmqpLoggerService } from './amqp-logger.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'LOGGER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const rabbitmqOptions: RmqOptions = {
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get(
                'RABBITMQ_USERNAME',
              )}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get(
                'RABBITMQ_URL',
              )}:${configService.get('RABBITMQ_PORT')}`,
            ],
            queue: 'logger_queue',
            queueOptions: {
              durable: false,
            },
          },
        };
        return ClientProxyFactory.create(rabbitmqOptions);
      },
      inject: [ConfigService],
    },
    AmqpLoggerService,
  ],
  exports: [AmqpLoggerService],
})
export class AmqpLoggerModule {}
