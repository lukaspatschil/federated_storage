import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogEntry } from '../../service-types/types';
import fs from 'fs/promises';

@Injectable()
export class AppService {
  private filePath: string

  constructor(private configService: ConfigService) {
    this.filePath = this.configService.get<string>('FILE_PATH') ?? '.';
  }

  async writeToFile(logEntry: LogEntry) {
    const logMessage = `[${logEntry.serviceName}] -- ${logEntry.date}   ${logEntry.level}  ${logEntry.message}\n`

    await fs.appendFile(this.filePath, logMessage);
  }
}
