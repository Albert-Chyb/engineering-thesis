import { CommonModule } from '@angular/common';
import { Component, ErrorHandler, inject } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NoDataInfoComponent } from '@common/components/no-data-info/no-data-info.component';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { BottomSheetAction } from '@utils/bottom-sheet-actions/bottom-sheet-action';
import { BottomSheetActionsTriggerDirective } from '@utils/bottom-sheet-actions/bottom-sheet-actions-trigger.directive';
import { CommonDialogsService } from '@utils/common-dialogs/common-dialogs.service';
import { LoadingIndicatorComponent } from '@utils/loading-indicator/components/loading-indicator/loading-indicator.component';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { PageStatesDirective } from '@utils/page-states/page-states.directive';
import { filter, map, take } from 'rxjs';
import { UserTestsPageErrorHandler } from './user-tests-page.error-handler';
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
    PageStatesDirective,
    LoadingIndicatorComponent,
  ],
  templateUrl: './user-tests.component.html',
  styleUrl: './user-tests.component.scss',
  providers: [
    {
      provide: ErrorHandler,
      useClass: UserTestsPageErrorHandler,
    },
    UserTestsStore,
    CommonDialogsService,
    {
      provide: PAGE_STATE_INDICATORS,
      useExisting: UserTestsStore,
    },
  ],
})
export class UserTestsComponent {
  private readonly store = inject(UserTestsStore);
  private readonly router = inject(Router);
  private readonly userTests = inject(UserTestsService);
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
    this.store.load();
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
}
