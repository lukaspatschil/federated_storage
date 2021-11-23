import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogEntry } from './service-types/types';
import * as fs from 'fs';
import { join } from 'path';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LoggerService {
  private filePath: string;

  constructor(private configService: ConfigService) {
    this.updateFilePath();
  }

  writeToFile(logEntry: LogEntry) {
    const logMessage = `[${logEntry.serviceName}]    ${logEntry.date}    ${logEntry.level}    ${logEntry.message}\n`;

    console.log(`Logging message: "${logMessage}"`);

    fs.appendFileSync(this.filePath, logMessage);
  }

  @Cron('* * 12 * * *')
  updateFilePath() {
    const time = new Date().toISOString();
    const dir = this.configService.get<string>('LOG_FILE_PATH');

    if (dir) {
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, { recursive: true });
      }
    }

    this.filePath = join(
      this.configService.get<string>('LOG_FILE_PATH') ?? '.',
      `${time}.log`,
    );
  }
}
