import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
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
import { AssembledTest } from '@test-creator/types/assembled-test';
import { SolvedTestAnswerRecordValue } from '@tests-grading/types/solved-test-answers';
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

  readonly form = new FormGroup({
    testTakerName: new FormControl('', Validators.required),
    answers: new FormGroup<
      Record<string, FormControl<SolvedTestAnswerRecordValue>>
    >({}),
  });

  constructor() {
    effect(() => {
      const isSaved = this.isSaved();

      if (isSaved) {
        this.showSavedSuccessfullyDialog();
      }
    });

    effect(() => {
      const test = this.test();

      if (test) {
        this.rebuildAnswersFormGroup(test);
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

  getAnswerControl(questionId: string) {
    const control = this.form.controls.answers.get(questionId) as FormControl;

    if (!control) {
      throw new Error(`No answer control for question with id ${questionId}.`);
    }

    return control;
  }

  handleFormSubmit() {
    const testForm = this.form;
    const solvedTest = SolvedTestFormValueSchema.parse(testForm.value);

    this.store.saveSolvedTest(solvedTest);
  }

  private rebuildAnswersFormGroup(test: AssembledTest) {
    const answersForm: FormGroup = this.form.controls.answers;

    for (const controlName in answersForm) {
      answersForm.removeControl(controlName, { emitEvent: false });
    }

    for (const question of test.questions) {
      answersForm.addControl(question.id, new FormControl(null), {
        emitEvent: false,
      });
    }

    answersForm.updateValueAndValidity();
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
