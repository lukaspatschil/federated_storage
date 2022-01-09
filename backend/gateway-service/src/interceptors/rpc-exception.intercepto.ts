import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { status } from '@grpc/grpc-js';

@Injectable()
export class RpcExcpetionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const logger = new Logger('gateway-service');
        logger.error(
          'An error was cougth by interceptor: ' + JSON.stringify(err),
        );

        if (err?.code && err.code === status.NOT_FOUND) {
          throw new NotFoundException();
        }

        if (err?.code && err.code === status.INTERNAL) {
          throw new InternalServerErrorException();
        }

        throw new InternalServerErrorException();
      }),
    );
  }
}
