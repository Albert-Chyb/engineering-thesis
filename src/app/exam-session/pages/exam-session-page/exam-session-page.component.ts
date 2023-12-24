import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiChoiceQuestionComponent } from '@exam-session/components/multi-choice-question/multi-choice-question.component';
import { SingleChoiceQuestionComponent } from '@exam-session/components/single-choice-question/single-choice-question.component';
import { TestTakerNameComponent } from '@exam-session/components/test-taker-name/test-taker-name.component';
import { TextAnswerQuestionComponent } from '@exam-session/components/text-answer-question/text-answer-question.component';
import { SolvedTestFormValueSchema } from '@exam-session/types/solved-test-form-value';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';
import { AssembledQuestion } from '@test-creator/types/assembled-test';
import { CommonDialogsService } from '@utils/common-dialogs/common-dialogs.service';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { PageStatesDirective } from '@utils/page-states/page-states.directive';
import { map, take } from 'rxjs';
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
    ReactiveFormsModule,
    MatButtonModule,
    PageStatesDirective,
    LoadingIndicatorComponent,
  ],
  templateUrl: './exam-session-page.component.html',
  styleUrl: './exam-session-page.component.scss',
  providers: [
    ExamSessionPageStore,
    {
      provide: PAGE_STATE_INDICATORS,
      useExisting: ExamSessionPageStore,
    },
  ],
})
export class ExamSessionPageComponent {
  private readonly store = inject(ExamSessionPageStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly commonDialogs = inject(CommonDialogsService);

  readonly error = this.store.error;
  readonly metadata = this.store.metadata;
  readonly test = this.store.test;
  readonly isSaved = this.store.isSaved;

  readonly testForm = computed(() => {
    const test = this.test();

    if (!test) {
      return null;
    }

    const testForm = new FormGroup({
      testTakerName: new FormControl('', Validators.required),
      answers: this.buildAnswersFormGroup(test.questions),
    });

    return testForm;
  });

  constructor() {
    effect(() => {
      const isSaved = this.isSaved();

      if (isSaved) {
        this.showSavedSuccessfullyDialog();
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

  handleFormSubmit() {
    const testForm = this.safelyGetTestForm();
    const solvedTest = SolvedTestFormValueSchema.parse(testForm.value);

    this.store.saveSolvedTest(solvedTest);
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

  private showSavedSuccessfullyDialog() {
    this.commonDialogs
      .alert(
        'Zapisano odpowiedzi',
        'Twoje rozwiązania zostały poprawnie zapisane.',
      )
      .pipe(take(1))
      .subscribe(() => this.router.navigateByUrl('/'));
  }
}
