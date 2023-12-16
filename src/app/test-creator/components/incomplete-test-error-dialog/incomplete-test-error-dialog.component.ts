import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-incomplete-test-error-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatListModule, MatButtonModule],
  templateUrl: './incomplete-test-error-dialog.component.html',
  styleUrl: './incomplete-test-error-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncompleteTestErrorDialogComponent {}
