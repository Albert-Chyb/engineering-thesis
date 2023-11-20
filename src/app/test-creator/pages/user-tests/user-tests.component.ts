import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NoDataInfoComponent } from '@common/components/no-data-info/no-data-info.component';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import {
  NewTestPromptComponent,
  NewTestPromptResult,
} from '@test-creator/components/new-test-prompt/new-test-prompt.component';
import {
  TestActionsBottomSheetComponent,
  TestActionsBottomSheetResult,
} from '@test-creator/components/test-actions-bottom-sheet/test-actions-bottom-sheet.component';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { filter, map, take } from 'rxjs';
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
    MatTooltipModule,
    NoDataInfoComponent,
  ],
  templateUrl: './user-tests.component.html',
  styleUrl: './user-tests.component.scss',
  providers: [UserTestsStore],
})
export class UserTestsComponent implements OnDestroy {
  private readonly store = inject(UserTestsStore);
  private readonly bottomSheets = inject(MatBottomSheet);
  private readonly dialogs = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly userTests = inject(UserTestsService);
  private readonly pendingIndicatorService = inject(PendingIndicatorService);

  readonly tests = this.store.tests;

  constructor() {
    this.pendingIndicatorService.connectStateChanges({
      onPendingChange$: this.store.pendingState$,
    });

    this.store.load();
  }

  ngOnDestroy(): void {
    this.pendingIndicatorService.disconnectStateChanges();
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

  showNewTestPrompt() {
    const dialogRef = this.dialogs.open<
      NewTestPromptComponent,
      void,
      NewTestPromptResult
    >(NewTestPromptComponent);

    this.store.create(
      dialogRef.afterClosed().pipe(
        take(1),
        map((initialTest) => {
          if (!initialTest) {
            return null as any;
          }

          return {
            id: this.userTests.generateId(),
            name: initialTest.name,
          };
        }),
        filter((test) => test !== null)
      )
    );
  }
}
