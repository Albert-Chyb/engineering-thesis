import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BottomSheetAction } from './bottom-sheet-action';

export type BottomSheetActionsData = BottomSheetAction[];
export type BottomSheetActionsResult = string;

@Component({
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  template: `
    <mat-action-list>
      @for (action of actions; track action.name) {
        <button mat-list-item (click)="handleActionClick(action)">
          <mat-icon matListItemIcon>{{ action.icon }}</mat-icon>
          <span matListItemTitle>{{ action.title }}</span>
          <span matListItemLine>{{ action.description }}</span>
        </button>
      }
    </mat-action-list>
  `,
})
export class BottomSheetActionsComponent {
  readonly actions: BottomSheetActionsData = inject(MAT_BOTTOM_SHEET_DATA);
  readonly bottomSheetRef: MatBottomSheetRef<
    BottomSheetActionsData,
    BottomSheetActionsResult
  > = inject(MatBottomSheetRef);

  handleActionClick(action: BottomSheetAction) {
    this.bottomSheetRef.dismiss(action.name);
  }
}
