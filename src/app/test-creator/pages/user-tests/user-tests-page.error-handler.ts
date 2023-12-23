import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FunctionsError } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import {
  IncompleteTestErrorDialogComponent,
  IncompleteTestErrorDialogData,
} from '@test-creator/components/incomplete-test-error-dialog/incomplete-test-error-dialog.component';

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
      const cloudFnError = error as FunctionsError;
      const issues = cloudFnError.details as string[];

      this.zone.run(() => {
        this.dialogs.open<
          IncompleteTestErrorDialogComponent,
          IncompleteTestErrorDialogData,
          void
        >(IncompleteTestErrorDialogComponent, {
          data: { issues },
        });
      });
    } else {
      this.parentErrorHandler.handleError(error);
    }
  }
}
