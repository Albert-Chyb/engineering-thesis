import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
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
  test: Test | null;
  questions: Question<QuestionsTypes>[];
  answers: Map<AnswerEntryKey, AnswerEntryValue>;
  error: any | null;
}

const INITIAL_STATE: TestCreatorPageState = {
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
  readonly questions = this.selectSignal((state) => state.questions);

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

  /**
   * Saves the question on the database.
   */
  readonly saveQuestion = this.effect(
    (question$: Observable<Question<QuestionsTypes>>) =>
      question$.pipe(
        concatMap((question) => {
          const testId = this.test()?.id ?? '';

          if (!testId) {
            throw new Error(
              'Tried to update a question without previously loading the test.'
            );
          }

          return this.questionsService.getController(testId).create(
            {
              content: question.content,
              type: question.type,
            },
            question.id
          );
        })
      )
  );

  readonly addQuestion = this.updater(
    (state, question: Question<QuestionsTypes>) => {
      return {
        ...state,
        questions: [...state.questions, question],
      };
    }
  );

  /**
   * Updates the local question state.
   */
  readonly updateQuestion = this.updater(
    (state, newQuestion: Question<QuestionsTypes>) => {
      const id = newQuestion.id;
      const questionIndex = state.questions.findIndex(
        (question) => question.id === id
      );

      if (questionIndex === -1) {
        throw new Error('Tried to update a question that does not exist');
      }

      const updatedQuestions = [...state.questions];
      updatedQuestions[questionIndex] = newQuestion;

      return {
        ...state,
        questions: updatedQuestions,
      };
    }
  );

  /**
   * Updates the test locally.
   */
  readonly updateTest = this.updater((state, test: Test) => {
    return {
      ...state,
      test,
    };
  });
}
