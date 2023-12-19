import { CommonModule } from '@angular/common';
import { Component, ErrorHandler, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { MultiChoiceQuestionComponent } from '@exam-session/components/multi-choice-question/multi-choice-question.component';
import { SingleChoiceQuestionComponent } from '@exam-session/components/single-choice-question/single-choice-question.component';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import { map } from 'rxjs';
import { ExamSessionPageStore } from './exam-session-page.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleChoiceQuestionComponent,
    MultiChoiceQuestionComponent,
    MatCardModule,
  ],
  templateUrl: './exam-session-page.component.html',
  styleUrl: './exam-session-page.component.scss',
  providers: [ExamSessionPageStore],
})
export class ExamSessionPageComponent {
  private readonly store = inject(ExamSessionPageStore);
  private readonly pendingIndicator = inject(PendingIndicatorService);
  private readonly route = inject(ActivatedRoute);
  private readonly errorHandler = inject(ErrorHandler);

  readonly error = this.store.error;
  readonly metadata = this.store.metadata;
  readonly test = this.store.test;

  constructor() {
    this.pendingIndicator.connectStateChanges({
      onPendingChange$: this.store.pendingIndicatorChanges$,
    });

    effect(() => {
      const error = this.error();

      if (error) {
        this.errorHandler.handleError(error);
      }
    });

    this.store.load(
      this.route.params.pipe(
        map((params) => {
          const id = params['id'];

          if (!id) {
            throw new Error('No test id provided.');
          }

          return params['id'];
        })
      )
    );
  }
}
