import { LOG_LEVEL } from '../enums/logLevels.enum';

export interface LogEntry {
  message: string;
  date: string;
  level: LOG_LEVEL;
}