import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

type TestActionsBottomSheetAction = 'edit' | 'delete';

export interface TestActionsBottomSheetResult {
  action: TestActionsBottomSheetAction;
}

@Component({
  selector: 'app-test-actions-bottom-sheet',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './test-actions-bottom-sheet.component.html',
  styleUrl: './test-actions-bottom-sheet.component.scss',
})
export class TestActionsBottomSheetComponent {
  private readonly bottomSheetRef = inject(
    MatBottomSheetRef<TestActionsBottomSheetComponent>
  );

  readonly actions = [
    {
      action: 'edit',
      label: 'Edytuj',
      description: 'Przejdź do edycji',
      icon: 'edit',
    },
    {
      action: 'delete',
      label: 'Usuń',
      description: 'Usuń test',
      icon: 'delete',
    },
  ] as const;

  handleActionClick(action: TestActionsBottomSheetAction) {
    this.bottomSheetRef.dismiss({ action });
  }
}
