import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { NoDataInfoComponent } from '@common/components/no-data-info/no-data-info.component';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';
import { SolvedTest } from '@tests-grading/types/solved-test';
import { BottomSheetAction } from '@utils/bottom-sheet-actions/bottom-sheet-action';
import { BottomSheetActionsTriggerDirective } from '@utils/bottom-sheet-actions/bottom-sheet-actions-trigger.directive';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { PageStatesDirective } from '@utils/page-states/page-states.directive';
import { map, take } from 'rxjs';
import { SubmittedSolutionsPageStore } from './submitted-solutions-page.store';

@Component({
  selector: 'app-submitted-solutions-page',
  standalone: true,
  imports: [
    CommonModule,
    LoadingIndicatorComponent,
    MatListModule,
    MatCardModule,
    MatBottomSheetModule,
    BottomSheetActionsTriggerDirective,
    PageStatesDirective,
    NoDataInfoComponent,
    MatIconModule,
  ],
  templateUrl: './submitted-solutions-page.component.html',
  styleUrl: './submitted-solutions-page.component.scss',
  providers: [
    SubmittedSolutionsPageStore,
    {
      provide: PAGE_STATE_INDICATORS,
      useExisting: SubmittedSolutionsPageStore,
    },
  ],
})
export class SubmittedSolutionsPageComponent {
  private readonly store = inject(SubmittedSolutionsPageStore);
  private readonly route = inject(ActivatedRoute);

  private readonly sharedTestId$ = this.route.paramMap.pipe(
    map((params) => {
      const sharedTestId = params.get('id');

      if (!sharedTestId) {
        throw new Error('sharedTestId is missing');
      }

      return sharedTestId;
    }),
  );

  readonly solvedTests = this.store.solvedTests;

  readonly pageActions: BottomSheetAction[] = [
    {
      name: 'delete',
      icon: 'delete',
      description: 'Usuń rozwiązanie',
      title: 'Usuń',
    },
  ];

  constructor() {
    this.store.load(this.sharedTestId$);
  }

  isSolvedTestGraded(solvedTest: SolvedTest): boolean {
    return solvedTest.grade !== null;
  }

  handlePageAction(actionName: string, solvedTestId: string) {
    switch (actionName) {
      case 'delete':
        this.store.delete(
          this.sharedTestId$.pipe(
            take(1),
            map((sharedTestId) => ({
              sharedTestId,
              solvedTestId,
            })),
          ),
        );
        break;
    }
  }
}
