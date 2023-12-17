import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

export type IncompleteTestErrorDialogData = {
  issues: string[];
};

@Component({
  selector: 'app-incomplete-test-error-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatButtonModule],
  templateUrl: './incomplete-test-error-dialog.component.html',
  styleUrl: './incomplete-test-error-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncompleteTestErrorDialogComponent {
  private readonly data: IncompleteTestErrorDialogData =
    inject(MAT_DIALOG_DATA);
  readonly issues = this.data.issues;
}
