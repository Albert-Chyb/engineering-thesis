import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import {
  AlertDialogComponent,
  AlertDialogData,
} from './alert-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from './confirm-dialog.component';
import {
  PromptDialogComponent,
  PromptDialogData,
  PromptDialogResult,
} from './prompt-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class CommonDialogsService {
  private readonly dialogs = inject(MatDialog);

  prompt(data: PromptDialogData): Observable<string | undefined> {
    const dialogRef = this.dialogs.open<
      PromptDialogComponent,
      PromptDialogData,
      PromptDialogResult
    >(PromptDialogComponent, {
      data,
      panelClass: 'app-dialog',
    });

    return dialogRef.afterClosed();
  }

  confirm(title: string, message: string): Observable<boolean> {
    const dialogRef = this.dialogs.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmDialogComponent, {
      data: {
        title,
        message,
      },
      panelClass: 'app-dialog',
    });

    return dialogRef.afterClosed().pipe(map((result) => !!result));
  }

  alert(title: string, message: string): Observable<void> {
    const dialogRef = this.dialogs.open<
      AlertDialogComponent,
      AlertDialogData,
      void
    >(AlertDialogComponent, {
      data: {
        title,
        message,
      },
      panelClass: 'app-dialog',
    });

    return dialogRef.afterClosed().pipe(map(() => undefined));
  }
}
