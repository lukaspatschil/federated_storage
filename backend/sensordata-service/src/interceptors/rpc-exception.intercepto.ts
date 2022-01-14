import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const logger = new Logger('sensordata-service');
        logger.error(
          'An error was cougth by interceptor: ' + JSON.stringify(err),
        );

        if (err?.code && err.code === status.NOT_FOUND) {
          throw new RpcException({
            code: status.NOT_FOUND,
            message: err.details,
          });
        }

        if (err?.code && err.code === status.INTERNAL) {
          throw new RpcException({
            code: status.INTERNAL,
            message: err.details,
          });
        }

        throw new RpcException('unintentional RpcException');
      }),
    );
  }
}
