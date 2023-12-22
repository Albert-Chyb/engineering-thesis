import { CommonModule } from '@angular/common';
import { Component, ErrorHandler, effect, inject } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import { BottomSheetAction } from '@utils/bottom-sheet-actions/bottom-sheet-action';
import { BottomSheetActionsTriggerDirective } from '@utils/bottom-sheet-actions/bottom-sheet-actions-trigger.directive';
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
  ],
  templateUrl: './submitted-solutions-page.component.html',
  styleUrl: './submitted-solutions-page.component.scss',
  providers: [SubmittedSolutionsPageStore],
})
export class SubmittedSolutionsPageComponent {
  private readonly store = inject(SubmittedSolutionsPageStore);
  private readonly pendingIndicator = inject(PendingIndicatorService);
  private readonly errorHandler = inject(ErrorHandler);
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
  readonly error = this.store.error;
  readonly loadingState = this.store.pendingState$;
  readonly solvedTests = this.store.solvedTests;
  readonly isLoading = this.store.isLoading;

  readonly pageActions: BottomSheetAction[] = [
    {
      name: 'delete',
      icon: 'delete',
      description: 'Usuń rozwiązanie',
      title: 'Usuń',
    },
  ];

  constructor() {
    this.pendingIndicator.connectStateChanges({
      onPendingChange$: this.loadingState,
    });

    effect(() => {
      const error = this.error();

      if (error) {
        this.errorHandler.handleError(error);
      }
    });

    this.store.load(this.sharedTestId$);
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
