import { ConsoleLogger, Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LogEntry, LOG_LEVEL } from '../../../service-types/types';

@Injectable()
export class AmqpLoggerService extends ConsoleLogger {
  constructor(
    @Inject('LOGGER_SERVICE') private readonly amqpConnection: ClientProxy,
  ) {
    super();

    amqpConnection.connect();
  }

  override log(message: string, context?: string, ...optionalParams: any[]) {
    super.log(message, context, ...optionalParams);

    this.publishToMQ(message, context, LOG_LEVEL.LOG);
  }

  override error(message: string, context?: string, ...optionalParams: any[]) {
    super.error(message, context, ...optionalParams);

    this.publishToMQ(message, context, LOG_LEVEL.ERROR);
  }

  override warn(message: string, context?: string, ...optionalParams: any[]) {
    super.warn(message, context, ...optionalParams);

    this.publishToMQ(message, context, LOG_LEVEL.WARN);
  }

  override debug(message: string, context?: string, ...optionalParams: any[]) {
    super.debug(message, context, ...optionalParams);

    this.publishToMQ(message, context, LOG_LEVEL.DEBUG);
  }

  override verbose(
    message: string,
    context?: string,
    ...optionalParams: any[]
  ) {
    super.verbose(message, context, ...optionalParams);

    this.publishToMQ(message, context, LOG_LEVEL.VERBOSE);
  }

  private publishToMQ(message: string, context = '', level: LOG_LEVEL) {
    const logMessage: LogEntry = {
      serviceName: context,
      message,
      date: new Date().toISOString(),
      level,
    };

    this.amqpConnection.emit({ cmd: 'log' }, logMessage);
  }
}
