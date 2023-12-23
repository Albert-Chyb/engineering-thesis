import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export type AlertDialogData = {
  title: string;
  message: string;
};

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>

    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="accent">OK</button>
    </mat-dialog-actions>
  `,
})
export class AlertDialogComponent {
  readonly data: AlertDialogData = inject(MAT_DIALOG_DATA);
}
