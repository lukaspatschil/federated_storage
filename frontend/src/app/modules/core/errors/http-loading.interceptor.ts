import {
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadingService } from '../loading/loading.service';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  constructor(private readonly loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.isLoading(true);
    return next.handle(request).pipe(
      finalize(() => {
        this.loadingService.isLoading(false);
      })
    );
  }
}
