import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorPresenterService {
  private readonly router = inject(Router);

  /**
   * Informs the user that an unhandled error has occurred.
   * @returns A promise that resolves true if the error was successfully presented.
   */
  presentUnhandledError() {
    return this.router.navigateByUrl('/error', { skipLocationChange: true });
  }
}
