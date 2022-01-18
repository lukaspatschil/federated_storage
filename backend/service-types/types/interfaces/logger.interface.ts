import { LOG_LEVEL } from "../enums/logLevels.enum";

export interface LogEntry {
  serviceName: string;
  message: string;
  date: string;
  level: LOG_LEVEL;
}
