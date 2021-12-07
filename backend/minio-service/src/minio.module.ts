import { Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import { MinioService } from './minio.service';
import { ConfigModule } from '@nestjs/config';
import { AmqpLoggerModule } from './amqp-logger/amqp-logger.module';

@Module({
  imports: [ConfigModule, AmqpLoggerModule],
  controllers: [MinioController],
  providers: [MinioService],
})
export class MinioModule {}
