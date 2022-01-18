import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LogEntry } from './service-types/types';
import { LoggerService } from './logger.service';

@Controller()
export class LoggerController {
  private readonly logger = new Logger(LoggerController.name);

  constructor(private readonly loggerService: LoggerService) {}

  @MessagePattern({ cmd: 'log' })
  log(@Payload() logEntry: LogEntry) {
    this.loggerService.writeToFile(logEntry);
  }
}
