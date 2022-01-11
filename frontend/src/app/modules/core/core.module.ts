import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalErrorHandler } from './errors/global-error-handler';
import { HttpLoadingInterceptor } from './errors/http-loading.interceptor';
import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [ToastComponent, LoadingComponent],
  imports: [CommonModule, NgbModule],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true
    }
  ],
  exports: [ToastComponent, LoadingComponent]
})
export class CoreModule {}
