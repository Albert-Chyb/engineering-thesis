import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Question } from '@test-creator/classes/question';
import {
  QuestionMetadata,
  questionsMetadata,
} from '@test-creator/classes/questions-metadata';
import { AnswersService } from '@test-creator/services/answers/answers.service';
import { QuestionsService } from '@test-creator/services/questions/questions.service';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { Answer } from '@test-creator/types/answer';
import {
  ClosedQuestionsTypes,
  QuestionsTypes,
} from '@test-creator/types/questions';
import { Test } from '@test-creator/types/test';
import {
  EMPTY,
  Observable,
  catchError,
  concatMap,
  defaultIfEmpty,
  forkJoin,
  map,
  switchMap,
  take,
  throwError,
} from 'rxjs';

type AnswerActionPayload = {
  questionId: string;
  answer: Answer<ClosedQuestionsTypes>;
};

type AnswerEntryKey = string;
type AnswerEntryValue = Answer<ClosedQuestionsTypes>[];
type AnswerEntry = [AnswerEntryKey, AnswerEntryValue];

interface TestCreatorPageState {
  test: Test | null;
  questions: Question<QuestionsTypes>[];
  questionsMetadata: QuestionMetadata<QuestionsTypes>[];
  answers: Map<AnswerEntryKey, AnswerEntryValue>;
  error: any | null;
}

const INITIAL_STATE: TestCreatorPageState = {
  test: null,
  questions: [],
  answers: new Map(),
  error: null,
  questionsMetadata: questionsMetadata.getMetadataForAllTypes(),
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
  readonly questionsMetadata = this.selectSignal(
    (state) => state.questionsMetadata
  );
  readonly answers = this.selectSignal((state) => state.answers);

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
              .pipe(
                take(1),
                map((answers) => [question.id, answers] as AnswerEntry)
              )
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
              position: question.position,
            },
            question.id
          );
        })
      )
  );

  readonly deleteQuestionFromDb = this.effect(
    (question$: Observable<Question<QuestionsTypes>>) =>
      question$.pipe(
        concatMap((question) => {
          const testId = this.test()?.id;

          if (!testId) {
            throw new Error(
              'Tried to delete a question without previously loading the test.'
            );
          }

          return this.questionsService
            .getController(testId)
            .delete(question.id)
            .pipe(
              catchError((error) => {
                this.addQuestion(question);

                return EMPTY;
              })
            );
        }),
        tapResponse(
          () => {},
          (error) => {
            this.setState((state) => ({ ...state, error }));
          }
        )
      )
  );

  readonly swapQuestionsOnDb = this.effect(
    (
      $: Observable<{
        from: Question<QuestionsTypes>;
        to: Question<QuestionsTypes>;
      }>
    ) =>
      $.pipe(
        concatMap(({ from: fromQuestion, to: toQuestion }) => {
          const testId = this.test()?.id;

          if (!testId) {
            throw new Error(
              'Tried to swap questions without previously loading the test.'
            );
          }

          const questionsService = this.questionsService.getController(testId);

          return questionsService.swapPositions(fromQuestion, toQuestion).pipe(
            catchError((error) => {
              this.swapQuestions({ from: toQuestion, to: fromQuestion });

              return EMPTY;
            })
          );
        }),
        tapResponse(
          () => {},
          (error) => {
            this.setState((state) => ({ ...state, error }));
          }
        )
      )
  );

  readonly saveAnswerOnDb = this.effect(
    (payload$: Observable<AnswerActionPayload>) =>
      payload$.pipe(
        concatMap(({ questionId, answer }) => {
          const testId = this.test()?.id;

          if (!testId) {
            throw new Error(
              'Tried to save an answer without previously loading the test.'
            );
          }

          const answersService = this.answersService.getController(
            testId,
            questionId
          );

          return answersService.create(
            {
              content: answer.content,
              position: answer.position,
            },
            answer.id
          );
        }),
        tapResponse(
          () => {},
          (error) => {
            this.patchState({ error });
          }
        )
      )
  );

  readonly deleteAnswerFromDb = this.effect(
    (payload$: Observable<{ questionId: string; answerId: string }>) =>
      payload$.pipe(
        concatMap(({ questionId, answerId }) => {
          const testId = this.test()?.id;

          if (!testId) {
            throw new Error(
              'Tried to delete an answer without previously loading the test.'
            );
          }

          const answersService = this.answersService.getController(
            testId,
            questionId
          );
          const answer = this.answers()
            .get(questionId)
            ?.find((a) => a.id === answerId);

          return answersService.delete(answerId);
        }),
        tapResponse(
          () => {},
          (error) => {
            this.patchState({ error });
          }
        )
      )
  );

  readonly updateAnswer = this.updater(
    (
      state,
      {
        questionId,
        answer,
      }: { questionId: string; answer: Answer<ClosedQuestionsTypes> }
    ) => {
      const newAnswer: Answer<ClosedQuestionsTypes> = {
        id: answer.id,
        content: answer.content,
        position: answer.position,
      };

      return {
        ...state,
        answers: new Map(state.answers).set(
          questionId,
          (state.answers.get(questionId) ?? []).map((a) =>
            a.id === answer.id ? newAnswer : a
          )
        ),
      };
    }
  );

  readonly deleteAnswer = this.updater(
    (state, payload: { questionId: string; answerId: string }) => {
      return {
        ...state,
        answers: new Map(state.answers).set(
          payload.questionId,
          (state.answers.get(payload.questionId) ?? []).filter(
            (answer) => answer.id !== payload.answerId
          )
        ),
      };
    }
  );

  readonly addAnswer = this.updater(
    (
      state,
      {
        questionId,
        answer,
      }: { questionId: string; answer: Answer<ClosedQuestionsTypes> }
    ) => {
      const newAnswer: Answer<ClosedQuestionsTypes> = {
        id: answer.id,
        content: answer.content,
        position: answer.position,
      };

      return {
        ...state,
        answers: new Map(state.answers).set(questionId, [
          ...(state.answers.get(questionId) ?? []),
          newAnswer,
        ]),
      };
    }
  );

  readonly swapQuestions = this.updater(
    (
      state,
      {
        from,
        to,
      }: { from: Question<QuestionsTypes>; to: Question<QuestionsTypes> }
    ) => {
      const questions = [...state.questions];
      const fromIndex = questions.findIndex(
        (question) => question.id === from.id
      );
      const toIndex = questions.findIndex((question) => question.id === to.id);

      if (fromIndex === -1 || toIndex === -1) {
        throw new Error('Tried to swap questions that do not exist');
      }

      if (fromIndex === toIndex) {
        return state;
      }

      questions[fromIndex] = new Question({ ...to, position: to.position });
      questions[toIndex] = new Question({ ...from, position: from.position });

      return {
        ...state,
        questions,
      };
    }
  );

  readonly deleteQuestion = this.updater(
    (state, question: Question<QuestionsTypes>) => {
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== question.id),
      };
    }
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
