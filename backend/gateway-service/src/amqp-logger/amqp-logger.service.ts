import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogEntry, LOG_LEVEL } from '../../../service-types/types';

@Injectable()
export class AmqpLoggerService extends ConsoleLogger {
  private readonly exchangeName: string;
  private readonly logsRoutingKey: string;

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {
    super();

    this.exchangeName = this.configService.get<string>('MQ_EXCHANGE_NAME');
    this.logsRoutingKey = this.configService.get<string>('MQ_LOGS_ROUTING_KEY');
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

    this.amqpConnection.publish(
      this.exchangeName,
      this.logsRoutingKey,
      logMessage,
    );
  }
}
