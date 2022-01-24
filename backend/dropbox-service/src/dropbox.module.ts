import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmqpLoggerModule } from './amqp-logger/amqp-logger.module';
import { DropboxController } from './dropbox.controller';
import { DropboxService } from './dropbox.service';

@Module({
  imports: [ConfigModule, AmqpLoggerModule],
  controllers: [DropboxController],
  providers: [DropboxService],
})
export class DropboxModule {}
