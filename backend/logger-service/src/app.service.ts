import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogEntry } from '../../service-types/types';
import fs from 'fs/promises';
import { join } from 'path';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private filePath: string;

  constructor(private configService: ConfigService) {
    this.updateFilePath();
  }

  async writeToFile(logEntry: LogEntry) {
    const logMessage = `[${logEntry.serviceName}] -- ${logEntry.date}    ${logEntry.level}    ${logEntry.message}\n`;

    await fs.appendFile(this.filePath, logMessage);
  }

  @Cron('* * 12 * * *')
  updateFilePath() {
    let time = new Date().getTime();
    time = time - (time % 86400000);

    this.filePath = join(
      this.configService.get<string>('FILE_PATH') ?? '.',
      `${time}.log`,
    );
  }
}
