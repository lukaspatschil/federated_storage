import { ConsoleLogger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
export declare class AmqpLoggerService extends ConsoleLogger {
    private readonly amqpConnection;
    constructor(amqpConnection: ClientProxy);
    log(message: string, context?: string, ...optionalParams: any[]): void;
    error(message: string, context?: string, ...optionalParams: any[]): void;
    warn(message: string, context?: string, ...optionalParams: any[]): void;
    debug(message: string, context?: string, ...optionalParams: any[]): void;
    verbose(message: string, context?: string, ...optionalParams: any[]): void;
    private publishToMQ;
}
