import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { PageComponent } from '@common/components/page/page.component';
import { BottomSheetAction } from '@utils/bottom-sheet-actions/bottom-sheet-action';
import { BottomSheetActionsTriggerDirective } from '@utils/bottom-sheet-actions/bottom-sheet-actions-trigger.directive';
import { SolvedTest } from '@utils/firestore/models/solved-tests.model';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { map } from 'rxjs';
import { SubmittedSolutionsPageStore } from './submitted-solutions-page.store';

@Component({
  selector: 'app-submitted-solutions-page',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatBottomSheetModule,
    BottomSheetActionsTriggerDirective,
    MatIconModule,
    PageComponent,
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
  private readonly router = inject(Router);

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
    {
      name: 'grade',
      icon: 'fact_check',
      description: 'Oceń poprawność rozwiązania',
      title: 'Oceń',
    },
  ];

  constructor() {
    this.store.load(this.sharedTestId$);
  }

  isSolvedTestGraded(solvedTest: SolvedTest): boolean {
    return solvedTest.grade !== null;
  }

  handlePageAction(actionName: string, solvedTest: SolvedTest) {
    switch (actionName) {
      case 'delete':
        this.store.delete({
          sharedTestId: solvedTest.sharedTestId,
          solvedTestId: solvedTest.id,
        });
        break;

      case 'grade':
        this.router.navigate([
          'shared-tests',
          solvedTest.sharedTestId,
          'submitted-solutions',
          solvedTest.id,
          'grade',
        ]);
        break;
    }
  }
}
