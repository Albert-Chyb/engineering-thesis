import { CommonModule } from '@angular/common';
import { Component, OnDestroy, effect, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FunctionsError } from '@angular/fire/functions';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
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
  IncompleteTestErrorDialogComponent,
  IncompleteTestErrorDialogData,
} from '@test-creator/components/incomplete-test-error-dialog/incomplete-test-error-dialog.component';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { BottomSheetAction } from '@utils/bottom-sheet-actions/bottom-sheet-action';
import { BottomSheetActionsTriggerDirective } from '@utils/bottom-sheet-actions/bottom-sheet-actions-trigger.directive';
import { CommonDialogsService } from '@utils/common-dialogs/common-dialogs.service';
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
    BottomSheetActionsTriggerDirective,
  ],
  templateUrl: './user-tests.component.html',
  styleUrl: './user-tests.component.scss',
  providers: [UserTestsStore, CommonDialogsService],
})
export class UserTestsComponent implements OnDestroy {
  private readonly store = inject(UserTestsStore);
  private readonly dialogs = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly userTests = inject(UserTestsService);
  private readonly pendingIndicatorService = inject(PendingIndicatorService);
  private readonly commonDialogs = inject(CommonDialogsService);

  readonly tests = this.store.tests;
  readonly error = this.store.error;

  readonly pageActions: BottomSheetAction[] = [
    {
      name: 'edit',
      title: 'Edytuj',
      description: 'Przejdź do edycji',
      icon: 'edit',
    },
    {
      name: 'delete',
      title: 'Usuń',
      description: 'Usuń test',
      icon: 'delete',
    },
    {
      name: 'share',
      title: 'Udostępnij',
      description: 'Udostępnij test',
      icon: 'share',
    },
  ];

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

  handlePageAction(actionName: string, testId: string) {
    switch (actionName) {
      case 'edit':
        this.router.navigate(['test-creator', testId]);
        break;

      case 'delete':
        this.store.delete(
          this.commonDialogs
            .confirm('Usuń test', 'Czy na pewno chcesz usunąć test ?')
            .pipe(
              filter((result) => !!result),
              map(() => testId),
            ),
        );
        break;

      case 'share':
        this.shareTest(testId);
        break;
    }
  }

  shareTest(testId: string) {
    this.store.shareTest(
      this.commonDialogs
        .prompt({
          title: 'Udostępnij test',
          message: 'Podaj pod jaką nazwą chcesz udostępnić test',
          input: {
            placeholder: 'Nazwa udostępnienia',
            label: 'Nazwa udostępnienia',
          },
        })
        .pipe(
          filter((name) => !!name),
          map((name) => ({
            name: name ?? '',
            testId,
          })),
        ),
    );
  }

  addNewTest() {
    this.store.create(
      this.commonDialogs
        .prompt({
          title: 'Nowy test',
          message: 'Podaj nazwę nowego testu',
          input: {
            placeholder: 'Nazwa testu',
            label: 'Nazwa testu',
          },
        })
        .pipe(
          take(1),
          filter((name) => !!name),
          map((name) => ({
            name: name ?? '',
            id: this.userTests.generateId(),
          })),
        ),
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
