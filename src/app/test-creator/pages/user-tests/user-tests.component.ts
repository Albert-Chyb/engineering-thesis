import { CommonModule } from '@angular/common';
import { Component, OnDestroy, effect, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FunctionsError } from '@angular/fire/functions';
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
import { IncompleteTestErrorDialogComponent, IncompleteTestErrorDialogData } from '@test-creator/components/incomplete-test-error-dialog/incomplete-test-error-dialog.component';
import {
  NewTestPromptComponent,
  NewTestPromptResult,
} from '@test-creator/components/new-test-prompt/new-test-prompt.component';
import {
  TestActionsBottomSheetComponent,
  TestActionsBottomSheetResult,
} from '@test-creator/components/test-actions-bottom-sheet/test-actions-bottom-sheet.component';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import {
  SharedTestMetadataDialogComponent,
  SharedTestMetadataDialogResult,
} from '@tests-sharing/components/shared-test-metadata-dialog/shared-test-metadata-dialog.component';
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
  readonly error = this.store.error;

  constructor() {
    this.pendingIndicatorService.connectStateChanges({
      onPendingChange$: this.store.pendingState$,
    });

    effect(() => {
      const error = this.error();

      if (error) {
        this.handleError(error);
      }
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

          case 'share':
            this.showSharedTestMetadataPrompt(testId);
            break;

          default:
            break;
        }
      });
  }

  showSharedTestMetadataPrompt(testId: string) {
    const dialogRef = this.dialogs.open<
      SharedTestMetadataDialogComponent,
      void,
      SharedTestMetadataDialogResult
    >(SharedTestMetadataDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          return;
        }

        this.store.shareTest({
          testId,
          name: result.name,
        });
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

  private handleError(error: unknown) {
    if (
      error instanceof FirebaseError &&
      error.code === 'functions/failed-precondition'
    ) {
      const cloudFnError = error as FunctionsError;
      const issues = cloudFnError.details as string[];

      this.dialogs.open<
        IncompleteTestErrorDialogComponent,
        IncompleteTestErrorDialogData,
        void
      >(IncompleteTestErrorDialogComponent, {
        data: { issues },
      });
    } else {
      throw error;
    }
  }
}
