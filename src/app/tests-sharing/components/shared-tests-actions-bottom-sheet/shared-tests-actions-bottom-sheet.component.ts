import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-shared-tests-actions-bottom-sheet',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './shared-tests-actions-bottom-sheet.component.html',
  styleUrl: './shared-tests-actions-bottom-sheet.component.scss',
})
export class SharedTestsActionsBottomSheetComponent {
  readonly actions = [
    {
      title: 'Pobierz link',
      icon: 'share',
      description: 'Skopiuj link do schowka',
    },
  ];
}
