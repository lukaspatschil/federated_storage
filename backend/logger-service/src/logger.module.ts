import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [LoggerController],
  providers: [LoggerService],
})
export class LoggerModule {}
