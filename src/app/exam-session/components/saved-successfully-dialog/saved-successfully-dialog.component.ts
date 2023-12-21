import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './saved-successfully-dialog.component.html',
  styleUrl: './saved-successfully-dialog.component.scss',
})
export class SavedSuccessfullyDialogComponent {}
