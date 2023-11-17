import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import {
  TestActionsBottomSheetComponent,
  TestActionsBottomSheetResult,
} from '@test-creator/components/test-actions-bottom-sheet/test-actions-bottom-sheet.component';
import { take } from 'rxjs';
import { UserTestsStore } from './user-tests.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './user-tests.component.html',
  styleUrl: './user-tests.component.scss',
  providers: [UserTestsStore],
})
export class UserTestsComponent {
  private readonly store = inject(UserTestsStore);
  private readonly bottomSheets = inject(MatBottomSheet);
  private readonly dialogs = inject(MatDialog);
  private readonly router = inject(Router);

  readonly tests = this.store.tests;

  constructor() {
    this.store.load();
  }

  showTestActions(testId: string) {
    const bottomSheetRef = this.bottomSheets.open<
      TestActionsBottomSheetComponent,
      void,
      TestActionsBottomSheetResult
    >(TestActionsBottomSheetComponent);

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((result) => {
        switch (result?.action) {
          case 'edit':
            this.router.navigate(['test-creator', testId]);
            break;

          case 'delete':
            this.store.delete(testId);
            break;

          default:
            break;
        }
      });
  }

  showTestNamePrompt() {}
}
