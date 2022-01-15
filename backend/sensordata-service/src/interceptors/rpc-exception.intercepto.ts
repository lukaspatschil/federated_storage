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
        const logger = new Logger(context.getClass().name);

        logger.error('An error was caught by interceptor: ' + err);
        if (err instanceof RpcException) {
          logger.error(JSON.stringify(err.getError()));
        } else {
          logger.error(JSON.stringify(err));
        }

        if (err instanceof RpcException) {
          throw err;
        }

        if (err?.code === status.NOT_FOUND && err?.details) {
          throw new RpcException({
            code: status.NOT_FOUND,
            message: err.details,
          });
        }

        if (err?.code === status.INTERNAL && err?.details) {
          throw new RpcException({
            code: status.INTERNAL,
            message: err.details,
          });
        }

        throw new RpcException('Unspecified Exception');
      }),
    );
  }
}
