import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-has-pending-tasks-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './has-pending-tasks-dialog.component.html',
  styleUrl: './has-pending-tasks-dialog.component.scss',
})
export class HasPendingTasksDialogComponent {}
