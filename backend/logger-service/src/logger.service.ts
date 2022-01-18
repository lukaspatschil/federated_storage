import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogEntry } from './service-types/types';
import * as fs from 'fs';
import { join } from 'path';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LoggerService implements OnModuleInit {
  private readonly logger = new Logger(LoggerService.name);
  private filePath: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.updateFilePath();
  }

  writeToFile(logEntry: LogEntry) {
    const logMessage = `[${logEntry.serviceName}]    ${logEntry.date}    ${logEntry.level}    ${logEntry.message}\n`;

    fs.appendFileSync(this.filePath, logMessage);
  }

  @Cron('1 0 0 * * *')
  updateFilePath() {
    const now = new Date();
    const premessage =
      this.configService.get<string>('LOGGER_FILE_PREFIX') ?? 'logfile';
    const fileDate = `${premessage}--${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()}`;
    const dir = this.configService.get<string>('LOG_FILE_PATH');

    if (dir) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    this.filePath = join(
      this.configService.get<string>('LOG_FILE_PATH') ?? '.',
      `${fileDate}.log`,
    );
    this.logger.log(`Updating file path to: ${this.filePath}`);
  }
}
