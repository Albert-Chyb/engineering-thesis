import { CommonModule } from '@angular/common';
import {
  Component,
  ErrorHandler,
  computed,
  effect,
  inject,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { MultiChoiceQuestionComponent } from '@exam-session/components/multi-choice-question/multi-choice-question.component';
import { SingleChoiceQuestionComponent } from '@exam-session/components/single-choice-question/single-choice-question.component';
import { TestTakerNameComponent } from '@exam-session/components/test-taker-name/test-taker-name.component';
import { TextAnswerQuestionComponent } from '@exam-session/components/text-answer-question/text-answer-question.component';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import { AssembledQuestion } from '@test-creator/types/assembled-test';
import { map } from 'rxjs';
import { ExamSessionPageStore } from './exam-session-page.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleChoiceQuestionComponent,
    MultiChoiceQuestionComponent,
    TextAnswerQuestionComponent,
    TestTakerNameComponent,
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

  readonly testForm = computed(() => {
    const test = this.test();

    if (!test) {
      return null;
    }

    const testForm = new FormGroup({
      testTakerName: new FormControl(''),
      answers: this.buildAnswersFormGroup(test.questions),
    });

    return testForm;
  });

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
        }),
      ),
    );
  }

  safelyGetTestForm() {
    const testForm = this.testForm();

    if (!testForm) {
      throw new Error('Test form is not initialized.');
    }

    return testForm;
  }

  safelyGetAnswersFormGroup(questionId: string): FormControl<any> {
    const test = this.safelyGetTestForm();
    const answers = test.controls.answers;
    const answersFormGroup = answers.get(questionId);

    if (!answersFormGroup) {
      throw new Error(
        `Answers form group for question with id ${questionId} is not initialized.`,
      );
    }

    return answersFormGroup as FormControl;
  }

  private buildAnswersFormGroup(
    questions: AssembledQuestion[],
  ): FormGroup<Record<string, FormControl<any>>> {
    const answers = new FormGroup({});

    questions.forEach((question) => {
      answers.addControl(question.id, new FormControl(null));
    });

    return answers;
  }
}
