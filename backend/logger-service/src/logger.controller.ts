import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { LogEntry } from './service-types/types';
import { LoggerService } from './logger.service';

@Controller()
export class LoggerController {
  constructor(private readonly appService: LoggerService) {}

  @MessagePattern({ cmd: 'log' })
  log(@Payload() logEntry: LogEntry) {
    this.appService.writeToFile(logEntry);
  }
}
