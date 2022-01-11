import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ToastService } from '../toast/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private toastService: ToastService, private zone: NgZone) {}

  handleError(error: any) {
    console.error('Error from global error handler', error);

    // Check if it's an error from an HTTP response
    // if (error instanceof HttpErrorResponse) {
    //   error = error.rejection; // get the error object
    // }
    this.zone.run(() =>
      this.toastService.show(
        'Error',
        `${String(error?.message) ?? 'Undefined client error'}\n${
          String(error?.status) ?? ''
        }`,
        { classname: 'bg-danger text-light' }
      )
    );
  }
}
