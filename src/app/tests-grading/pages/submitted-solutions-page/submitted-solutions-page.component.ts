import { CommonModule } from '@angular/common';
import { Component, ErrorHandler, effect, inject } from '@angular/core';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import { SubmittedSolutionsPageStore } from './submitted-solutions-page.store';

@Component({
  selector: 'app-submitted-solutions-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submitted-solutions-page.component.html',
  styleUrl: './submitted-solutions-page.component.scss',
  providers: [SubmittedSolutionsPageStore],
})
export class SubmittedSolutionsPageComponent {
  private readonly store = inject(SubmittedSolutionsPageStore);
  private readonly pendingIndicator = inject(PendingIndicatorService);
  private readonly errorHandler = inject(ErrorHandler);

  readonly error = this.store.error;
  readonly loadingState = this.store.pendingState$;

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
  }
}
