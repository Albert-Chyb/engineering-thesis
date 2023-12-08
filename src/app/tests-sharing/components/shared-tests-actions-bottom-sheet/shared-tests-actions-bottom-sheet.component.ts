import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

export type SharedTestsActions = 'copy-link';

@Component({
  selector: 'app-shared-tests-actions-bottom-sheet',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './shared-tests-actions-bottom-sheet.component.html',
  styleUrl: './shared-tests-actions-bottom-sheet.component.scss',
})
export class SharedTestsActionsBottomSheetComponent {
  private readonly bottomSheetRef = inject(MatBottomSheetRef);

  readonly actions: {
    id: SharedTestsActions;
    title: string;
    icon: string;
    description: string;
  }[] = [
    {
      id: 'copy-link',
      title: 'Pobierz link',
      icon: 'share',
      description: 'Skopiuj link do schowka',
    },
  ];

  handleActionClick(action: SharedTestsActions) {
    this.bottomSheetRef.dismiss(action);
  }
}
