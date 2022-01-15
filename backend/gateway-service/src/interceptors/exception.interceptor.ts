import {
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
export class ExcpetionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const logger = new Logger(context.getClass().name);

        logger.error('An error was caught by interceptor: ' + err);
        logger.error(JSON.stringify(err));

        if (err?.code === status.NOT_FOUND) {
          throw new NotFoundException();
        }

        if (err?.code === status.INTERNAL) {
          throw new InternalServerErrorException();
        }

        throw new InternalServerErrorException();
      }),
    );
  }
}
