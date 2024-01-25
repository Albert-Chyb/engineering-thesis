import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { MatDialog } from '@angular/material/dialog';
import { IncompleteTestErrorDialogComponent } from '@test-creator/components/incomplete-test-error-dialog/incomplete-test-error-dialog.component';

@Injectable()
export class UserTestsPageErrorHandler implements ErrorHandler {
  private readonly dialogs = inject(MatDialog);
  private readonly parentErrorHandler = inject(ErrorHandler, {
    skipSelf: true,
  });
  private readonly zone = inject(NgZone);

  handleError(error: unknown): void {
    if (
      error instanceof FirebaseError &&
      error.code === 'functions/failed-precondition'
    ) {
      this.zone.run(() => {
        this.dialogs.open<IncompleteTestErrorDialogComponent, void, void>(
          IncompleteTestErrorDialogComponent,
        );
      });
    } else {
      this.parentErrorHandler.handleError(error);
    }
  }
}
