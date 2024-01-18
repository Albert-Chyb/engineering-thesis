import { ErrorHandler, NgZone, inject } from '@angular/core';
import { ErrorPresenterService } from '@utils/presenting-errors/services/error-presenter/error-presenter.service';

export class AppErrorHandler implements ErrorHandler {
  private readonly zone = inject(NgZone);
  private readonly errorPresenter = inject(ErrorPresenterService);

  handleError(error: any): void {
    this.zone.run(() => {
      this.errorPresenter.presentUnhandledError();
    });

    console.error(error);
  }
}
