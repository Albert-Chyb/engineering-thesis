import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { answersGenerators } from '@test-creator/constants/answers-generators';
import { questionsGenerators } from '@test-creator/constants/questions-generators';
import { AnswersService } from '@test-creator/services/answers/answers.service';
import { QuestionsService } from '@test-creator/services/questions/questions.service';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { Answer } from '@test-creator/types/answer';
import { Question } from '@test-creator/types/question';
import {
  ClosedQuestionsTypes,
  QuestionsTypes,
} from '@test-creator/types/questions';
import { Test } from '@test-creator/types/test';
import {
  QuestionFormGroup,
  TestForm,
} from '@test-creator/types/test-creator-form';
import {
  Observable,
  concatMap,
  defaultIfEmpty,
  forkJoin,
  map,
  switchMap,
  throwError,
} from 'rxjs';

type AnswerEntryKey = string;
type AnswerEntryValue = Answer<ClosedQuestionsTypes>[];
type AnswerEntry = [AnswerEntryKey, AnswerEntryValue];

interface TestCreatorPageState {
  testForm: TestForm;
  test: Test | null;
  questions: Question<QuestionsTypes>[];
  answers: Map<AnswerEntryKey, AnswerEntryValue>;
  error: any | null;
}

const INITIAL_STATE: TestCreatorPageState = {
  testForm: new FormGroup({
    id: new FormControl('', { nonNullable: true }),
    name: new FormControl(''),
    questions: new FormArray<QuestionFormGroup<QuestionsTypes>>([]),
  }),
  test: null,
  questions: [],
  answers: new Map(),
  error: null,
};

@Injectable()
export class TestCreatorPageStore extends ComponentStore<TestCreatorPageState> {
  private readonly testsService = inject(UserTestsService);
  private readonly questionsService = inject(QuestionsService);
  private readonly answersService = inject(AnswersService);

  constructor() {
    super(INITIAL_STATE);
  }

  readonly test = this.selectSignal((state) => state.test);

  /**
   * Loads the test, questions and answers from the database.
   */
  readonly loadTestData = this.effect((id$: Observable<string>) =>
    id$.pipe(
      switchMap((id) => this.testsService.read(id)),
      switchMap((test) => {
        if (!test) {
          return throwError(() => new Error('Test not found'));
        }

        return this.questionsService
          .getController(test.id)
          .list()
          .pipe(map((questions) => ({ test, questions })));
      }),
      switchMap((data) =>
        forkJoin(
          data.questions.map((question) =>
            this.answersService
              .getController(data.test.id, question.id)
              .list()
              .pipe(map((answers) => [question.id, answers] as AnswerEntry))
          )
        ).pipe(
          defaultIfEmpty([] as any),
          map((answersForEachQuestion: AnswerEntry[]) => {
            return {
              ...data,
              answers: new Map(answersForEachQuestion),
            };
          })
        )
      ),
      tapResponse(
        (data) => {
          this.setState((state) => ({
            ...state,
            test: data.test,
            questions: data.questions,
            answers: data.answers,
          }));
        },
        (error) => {
          this.setState((state) => ({ ...state, error }));
        }
      )
    )
  );

  /**
   * Saves the test on the database.
   */
  readonly saveTest = this.effect((test$: Observable<Test>) =>
    test$.pipe(
      concatMap((newTest) =>
        this.testsService.create(
          {
            name: newTest.name,
          },
          newTest.id
        )
      ),
      tapResponse(
        () => {},
        (error) => {
          this.setState((state) => ({ ...state, error }));
        }
      )
    )
  );

  /** Updates the test locally. */
  readonly updateTest = this.updater((state, test: Test) => {
    return {
      ...state,
      test,
    };
  });

  private generateQuestion<TQuestionType extends QuestionsTypes>(
    question: Question<TQuestionType>
  ) {
    const generator = this.getQuestionGenerator(question.type);
    const formGroup = generator.generate(question);

    return formGroup;
  }

  private generateAnswer<TQuestionType extends ClosedQuestionsTypes>(
    type: TQuestionType,
    answer: Answer<TQuestionType>
  ) {
    const generator = this.getAnswerGenerator(type);
    const formGroup = generator.generate(answer);

    return formGroup;
  }

  private getQuestionGenerator<TQuestionType extends QuestionsTypes>(
    type: TQuestionType
  ) {
    return questionsGenerators[type];
  }

  private getAnswerGenerator<TQuestionType extends ClosedQuestionsTypes>(
    type: TQuestionType
  ) {
    return answersGenerators[type];
  }
}
