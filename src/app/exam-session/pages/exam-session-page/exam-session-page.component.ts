import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@authentication/services/auth.service';
import { AnswersFormComponent } from '@exam-session/components/answers-form/answers-form.component';
import { TestTakerNameComponent } from '@exam-session/components/test-taker-name/test-taker-name.component';
import { SolvedTestFormValueSchema } from '@exam-session/types/solved-test-form-value';
import { SolvedTestAnswerRecordValue } from '@tests-grading/types/solved-test-answers';
import { CommonDialogsService } from '@utils/common-dialogs/common-dialogs.service';
import { LoadingIndicatorComponent } from '@utils/loading-indicator/components/loading-indicator/loading-indicator.component';
import { PAGE_STATE_INDICATORS } from '@utils/page-states/injection-tokens';
import { PageStatesDirective } from '@utils/page-states/page-states.directive';
import { map, take } from 'rxjs';
import { ExamSessionPageStore } from './exam-session-page.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TestTakerNameComponent,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    PageStatesDirective,
    LoadingIndicatorComponent,
    AnswersFormComponent,
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
  private readonly auth = inject(AuthService);

  readonly error = this.store.error;
  readonly metadata = this.store.metadata;
  readonly test = this.store.test;
  readonly isSaved = this.store.isSaved;
  readonly user = toSignal(this.auth.user$);

  readonly form = new FormGroup({
    testTakerName: new FormControl('', Validators.required),
    answers: new FormGroup<
      Record<string, FormControl<SolvedTestAnswerRecordValue | null>>
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
      const user = this.user();
      const testTakerName = user?.displayName ?? '';

      this.form.patchValue({ testTakerName });
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

  handleFormSubmit() {
    const testForm = this.form;
    const solvedTest = SolvedTestFormValueSchema.parse(testForm.value);

    this.store.saveSolvedTest(solvedTest);
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
