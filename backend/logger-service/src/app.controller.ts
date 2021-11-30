import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { LogEntry } from './service-types/types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'log' })
  log(@Payload() logEntry: LogEntry, @Ctx() context: RmqContext) {
    this.appService.writeToFile(logEntry);
  }
}
