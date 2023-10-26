import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { DOC_ID_GENERATOR } from '@common/injection-tokens/doc-id-generator';
import { ServerController } from '@db-auto-sync/abstract/server-controller';
import { FirestoreServerController } from '@db-auto-sync/classes/firestore-server-controller';
import { DocumentSync } from '@db-auto-sync/core/document-sync';
import { FormArraySyncContainerComponent } from '@db-auto-sync/reactive-forms-utils/components/form-array-sync-container/form-array-sync-container.component';
import { FormGroupSyncDirective } from '@db-auto-sync/reactive-forms-utils/directives/form-group-sync/form-group-sync.directive';
import { FormGroupChangeSource } from '@db-auto-sync/reactive-forms-utils/form-group-change-source';
import { ChoiceQuestionComponent } from '@test-creator/components/choice-question/choice-question.component';
import { OpenQuestionComponent } from '@test-creator/components/open-question/open-question.component';
import { AnswersService } from '@test-creator/services/answers/answers.service';
import { QuestionsService } from '@test-creator/services/questions/questions.service';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { AnswerFormGroup } from '@test-creator/types/answer-form-group';
import { AnswersReorderEvent } from '@test-creator/types/answers-reorder-event';
import { AssembledTest } from '@test-creator/types/assembled-test';
import { QuestionsTypes } from '@test-creator/types/question';
import { QuestionFormGroup } from '@test-creator/types/question-form-group';
import { Test } from '@test-creator/types/test';
import { TestFormGroup } from '@test-creator/types/test-form-group';
import {
  Observable,
  combineLatest,
  defaultIfEmpty,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ChoiceQuestionComponent,
    OpenQuestionComponent,
    FormGroupSyncDirective,
    FormArraySyncContainerComponent,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './test-creator-page.component.html',
  styleUrls: ['./test-creator-page.component.scss'],
})
export class TestCreatorPageComponent {
  private readonly userTests = inject(UserTestsService);
  private readonly testQuestions = inject(QuestionsService);
  private readonly questionsAnswers = inject(AnswersService);
  private readonly route = inject(ActivatedRoute);
  private readonly generateId = inject(DOC_ID_GENERATOR);

  readonly testId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => {
      if (!id) {
        return throwError(() => new Error('Test id is not provided.'));
      } else {
        return of(id);
      }
    })
  );

  readonly assembledTest$: Observable<AssembledTest> = this.testId$.pipe(
    switchMap((id) =>
      this.userTests
        .read(id)
        .pipe(
          switchMap((test) => (test ? of(test) : this.createInitialTest(id)))
        )
    ),
    switchMap((partialTest) =>
      this.testQuestions
        .getController(partialTest.id)
        .readAll()
        .pipe(map((questions) => ({ ...partialTest, questions })))
    ),
    switchMap((partialTest) =>
      forkJoin(
        partialTest.questions.map((question) =>
          this.questionsAnswers
            .getController(partialTest.id, question.id)
            .readAll()
            .pipe(
              take(1),
              map((answers) => ({ ...question, answers }))
            )
        )
      ).pipe(
        defaultIfEmpty([]),
        map((questions) => ({ ...partialTest, questions }))
      )
    )
  );

  readonly testForm$: Observable<TestFormGroup> = this.assembledTest$.pipe(
    map((test) => {
      const form = new FormGroup({
        name: new FormControl(test.name),
        questions: new FormArray<QuestionFormGroup<QuestionsTypes>>(
          test.questions.map((question) => {
            const answers = question.answers ?? [];

            return new FormGroup({
              id: new FormControl(question.id, { nonNullable: true }),
              content: new FormControl(question.content),
              type: new FormControl(question.type, { nonNullable: true }),
              answers: new FormArray<AnswerFormGroup>(
                answers.map(
                  (answer) =>
                    new FormGroup({
                      content: new FormControl(answer.content),
                    })
                )
              ),
            });
          })
        ),
      });

      form.patchValue(test);

      return form;
    })
  );

  readonly questionsController$ = this.testId$.pipe(
    map(
      (id) =>
        new FirestoreServerController(this.testQuestions.getController(id))
    )
  );

  readonly viewModel$ = combineLatest([
    this.assembledTest$,
    this.testForm$,
    this.questionsController$,
  ]).pipe(
    map(([test, form, questionsController]) => ({
      test,
      form,
      questionsController,
      questionExcludedKeys: ['answers', 'id'],
    }))
  );

  readonly testsController = new FirestoreServerController(this.userTests);

  handleAnswersReorder($event: AnswersReorderEvent) {}

  handleAddAnswer(index: number) {}

  handleDeleteAnswer([questionIndex, answerIndex]: [number, number]) {}

  handleDeleteQuestion(id: string) {
    console.log('Delete question: ', id);
  }

  createQuestionSync<TQuestionType extends QuestionsTypes>(
    type: TQuestionType,
    serverController: ServerController<QuestionFormGroup<TQuestionType>>
  ): DocumentSync<QuestionFormGroup<TQuestionType>> {
    const id = this.generateId();
    const formGroup = this.createQuestion(type, id);

    return new DocumentSync(
      new FormGroupChangeSource(formGroup, ['answers', 'id']),
      serverController,
      id
    );
  }

  private createQuestion<TQuestionType extends QuestionsTypes>(
    type: TQuestionType,
    id: string
  ): QuestionFormGroup<TQuestionType> {
    if (type === 'open') {
      return new FormGroup({
        id: new FormControl(id, { nonNullable: true }),
        type: new FormControl<TQuestionType>(type, { nonNullable: true }),
        content: new FormControl(
          'Jaka jest twoja opinia na temat tego testu ?'
        ),
        answers: new FormArray<any>([]),
      });
    }

    return new FormGroup({
      id: new FormControl(id, { nonNullable: true }),
      type: new FormControl<TQuestionType>(type, { nonNullable: true }),
      content: new FormControl('Co to jest HTML ?'),
      answers: new FormArray<AnswerFormGroup>([
        new FormGroup({
          content: new FormControl('Język programowania'),
        }),
        new FormGroup({
          content: new FormControl('Język znaczników'),
        }),
        new FormGroup({
          content: new FormControl('Język skryptowy'),
        }),
        new FormGroup({
          content: new FormControl('Język do tworzenia stron internetowych'),
        }),
      ]),
    });
  }

  private swapControls(
    formArray: FormArray<any>,
    index1: number,
    index2: number
  ) {
    const temp = formArray.at(index1);

    formArray.removeAt(index1);
    formArray.insert(index2, temp);
  }

  private createInitialTest(id: string): Observable<Test> {
    return this.userTests
      .create(
        {
          name: 'Test bez nazwy',
        },
        id
      )
      .pipe(
        switchMap(
          (testRef) => this.userTests.read(testRef.id) as Observable<Test>
        )
      );
  }
}
