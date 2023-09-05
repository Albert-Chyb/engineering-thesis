import { ErrorHandler, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';

export class AppErrorHandler implements ErrorHandler {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  handleError(error: any): void {
    this.zone.run(() => {
      this.router.navigateByUrl('/error');
    });

    console.error(error);
  }
}
