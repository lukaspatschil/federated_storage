import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogEntry } from '../../service-types/types';
import fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class AppService {
  private filePath: string;

  constructor(private configService: ConfigService) {
    this.filePath = join(
      this.configService.get<string>('FILE_PATH') ?? '.',
      `${new Date().getUTCDate()}.log`,
    );
  }

  async writeToFile(logEntry: LogEntry) {
    const logMessage = `[${logEntry.serviceName}] -- ${logEntry.date}   ${logEntry.level}  ${logEntry.message}\n`;

    await fs.appendFile(this.filePath, logMessage);
  }
}
