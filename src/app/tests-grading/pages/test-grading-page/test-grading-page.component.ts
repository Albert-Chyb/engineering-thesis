import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { NoDataInfoComponent } from '@common/components/no-data-info/no-data-info.component';
import {
  TestGradingFormComponent,
  TestGradingFormData,
} from '@tests-grading/components/test-grading-form/test-grading-form.component';
import { TestTakerInfoComponent } from '@tests-grading/components/test-taker-info/test-taker-info.component';
import { SolvedTestAnswers } from '@tests-grading/types/solved-test-answers';
import { SolvedTestAnswersEvaluationsSchema } from '@tests-grading/types/solved-test-answers-evaluations';
import { LoadingIndicatorComponent } from '@utils/loading-indicator/components/loading-indicator/loading-indicator.component';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { PageStatesDirective } from '@utils/page-states/page-states.directive';
import { Observable, filter, map } from 'rxjs';
import { TestGradingPageStore } from './test-grading-page.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageStatesDirective,
    NoDataInfoComponent,
    LoadingIndicatorComponent,
    MatCardModule,
    TestTakerInfoComponent,
    TestGradingFormComponent,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './test-grading-page.component.html',
  styleUrl: './test-grading-page.component.scss',
  providers: [
    TestGradingPageStore,
    {
      provide: PAGE_STATE_INDICATORS,
      useExisting: TestGradingPageStore,
    },
  ],
})
export class TestGradingPageComponent {
  private readonly store = inject(TestGradingPageStore);
  private readonly route = inject(ActivatedRoute);

  readonly solvedTest = this.store.solvedTest;
  readonly solvedTestAnswers = this.store.solvedTestAnswers;
  readonly sharedTest = this.store.sharedTest;

  readonly questionsWithAnswers = computed<TestGradingFormData[]>(() => {
    const solvedTestAnswers = this.solvedTestAnswers();
    const sharedTest = this.sharedTest();

    if (!solvedTestAnswers || !sharedTest) {
      return [];
    }

    return sharedTest.questions.map((question) => {
      const answer = solvedTestAnswers.answers.find(
        (answer) => answer.questionId === question.id,
      );

      if (!answer) {
        throw new Error(
          `Answer for question with id ${question.id} was not found`,
        );
      }

      return {
        question,
        answer,
      };
    });
  });

  readonly answersEvaluationsForm = new FormGroup<
    Record<string, AbstractControl<null | boolean>>
  >({});

  constructor() {
    effect(() => {
      const answers = this.solvedTestAnswers()?.answers;

      if (!answers) {
        return;
      }

      this.rebuildControls(answers, this.answersEvaluationsForm);
    });

    this.store.evaluateAnswers(this.buildEvaluationChangesStream());
    this.store.load(this.getParams());
  }

  private buildEvaluationChangesStream() {
    return this.answersEvaluationsForm.valueChanges.pipe(
      filter(() => this.answersEvaluationsForm.dirty),
      map((value) => SolvedTestAnswersEvaluationsSchema.parse(value)),
    );
  }

  private rebuildControls(
    answers: SolvedTestAnswers['answers'],
    form: FormGroup<Record<string, AbstractControl<boolean | null>>>,
  ): void {
    for (const controlName in form.controls) {
      if (form.contains(controlName)) {
        form.removeControl(controlName, { emitEvent: false });
      }
    }

    answers.forEach((answer) => {
      form.addControl(
        answer.questionId,
        new FormControl<boolean | null>(answer.isCorrect),
        { emitEvent: false },
      );
    });

    form.markAsPristine();
    form.updateValueAndValidity();
  }

  private getParams(): Observable<{
    sharedTestId: string;
    solvedTestId: string;
  }> {
    return this.route.paramMap.pipe(
      map((params) => {
        const sharedTestId = params.get('sharedTestId');
        const solvedTestId = params.get('solvedTestId');

        if (!sharedTestId || !solvedTestId) {
          throw new Error('Missing params');
        }

        return { sharedTestId, solvedTestId };
      }),
    );
  }
}
