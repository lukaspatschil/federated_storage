import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AmqpLoggerService } from './amqp-logger.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `amqp://${configService.get(
          'RABBITMQ_USERNAME',
        )}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get(
          'RABBITMQ_URL',
        )}:${configService.get('RABBITMQ_PORT')}`,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [AmqpLoggerService],
  exports: [AmqpLoggerService],
})
export class AmqpLoggerModule {}
