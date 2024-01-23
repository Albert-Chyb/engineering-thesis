import { Injectable, inject } from '@angular/core';
import { QueuedComponentStore } from '@common/ngrx/queued-component-store';
import { tapResponse } from '@ngrx/component-store';
import { Question } from '@test-creator/classes/question';
import {
  QuestionMetadata,
  questionsMetadata,
} from '@test-creator/classes/questions-metadata';
import { AnswersService } from '@utils/firestore/collections-controllers/answers.service';
import { QuestionsService } from '@utils/firestore/collections-controllers/questions.service';
import { TestsService } from '@utils/firestore/collections-controllers/tests.service';
import { Answer } from '@utils/firestore/models/answers.model';
import { QuestionsTypes } from '@utils/firestore/models/questions.model';
import { Test } from '@utils/firestore/models/tests.model';
import { LoadingState } from '@utils/loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@utils/loading-indicator/ngrx/LoadingStateAdapter';
import {
  Observable,
  concatMap,
  defaultIfEmpty,
  forkJoin,
  map,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';

const loadingStateAdapter = new LoadingStateAdapter();
const { isLoading, isPending, tasksCount } = loadingStateAdapter.getSelectors();

type AnswerActionPayload = {
  questionId: string;
  answer: Answer;
};

type AnswerEntryKey = string;
type AnswerEntryValue = Answer[];
type AnswerEntry = [AnswerEntryKey, AnswerEntryValue];

interface TestCreatorPageState {
  loadingState: LoadingState;
  test: Test | null;
  questions: Question[];
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
  loadingState: loadingStateAdapter.getInitialState(),
};

@Injectable()
export class TestCreatorPageStore extends QueuedComponentStore<TestCreatorPageState> {
  private readonly testsService = inject(TestsService);
  private readonly questionsService = inject(QuestionsService);
  private readonly answersService = inject(AnswersService);

  constructor() {
    super(INITIAL_STATE);
  }

  readonly test = this.selectSignal((state) => state.test);
  readonly questions = this.selectSignal((state) => state.questions);
  readonly questionsMetadata = this.selectSignal(
    (state) => state.questionsMetadata,
  );
  readonly answers = this.selectSignal((state) => state.answers);

  readonly isLoading = this.selectSignal((state) =>
    isLoading(state.loadingState),
  );
  readonly isPending = this.selectSignal((state) =>
    isPending(state.loadingState),
  );
  readonly tasksCount = this.selectSignal((state) =>
    tasksCount(state.loadingState),
  );
  readonly pendingState$ = this.select({
    isPending: this.select((state) => isPending(state.loadingState)),
  });

  /**
   * Loads the test, questions and answers from the database.
   */
  readonly loadTestData = this.effect((id$: Observable<string>) =>
    id$.pipe(
      tap(() =>
        this.patchState((oldState) => ({
          loadingState: loadingStateAdapter.startLoading(oldState.loadingState),
        })),
      ),
      switchMap((id) => this.testsService.read(id)),
      switchMap((test) => {
        if (!test) {
          return throwError(() => new Error('Test not found'));
        }

        return this.questionsService
          .list([test.id])
          .pipe(map((questions) => ({ test, questions })));
      }),
      switchMap((data) =>
        forkJoin(
          data.questions.map((question) =>
            this.answersService.list([data.test.id, question.id]).pipe(
              take(1),
              map((answers) => [question.id, answers] as AnswerEntry),
            ),
          ),
        ).pipe(
          defaultIfEmpty([] as any),
          map((answersForEachQuestion: AnswerEntry[]) => {
            return {
              ...data,
              answers: new Map(answersForEachQuestion),
            };
          }),
        ),
      ),
      tapResponse(
        (data) => {
          this.setState((oldState) => ({
            ...oldState,
            test: data.test,
            questions: data.questions.map((question) => new Question(question)),
            answers: data.answers,
            loadingState: loadingStateAdapter.finishLoading(
              oldState.loadingState,
            ),
          }));
        },
        (error) =>
          this.patchState((oldState) => ({
            error,
            loadingState: loadingStateAdapter.finishLoading(
              oldState.loadingState,
            ),
          })),
      ),
    ),
  );

  /**
   * Saves the test on the database.
   */
  readonly saveTest = this.effect((test$: Observable<Test>) =>
    test$.pipe(
      tap(() =>
        this.patchState(({ loadingState }) => ({
          loadingState: loadingStateAdapter.taskStarted(loadingState),
        })),
      ),
      concatMap((newTest) =>
        this.testsService.create(
          {
            name: newTest.name,
          },
          newTest.id,
        ),
      ),
      tapResponse(
        () => {
          this.patchState(({ loadingState }) => ({
            loadingState: loadingStateAdapter.taskFinished(loadingState),
          }));
        },
        (error) => {
          this.patchState(({ loadingState }) => ({
            error,
            loadingState: loadingStateAdapter.taskFinished(loadingState),
          }));
        },
      ),
    ),
  );

  /**
   * Saves the question on the database.
   */
  readonly saveQuestion = this.effect((question$: Observable<Question>) =>
    question$.pipe(
      tap(() =>
        this.patchState(({ loadingState }) => ({
          loadingState: loadingStateAdapter.taskStarted(loadingState),
        })),
      ),
      concatMap((question) => {
        const testId = this.get((state) => state.test)?.id;

        if (!testId) {
          throw new Error(
            'Tried to update a question without previously loading the test.',
          );
        }

        return this.questionsService.create(
          {
            content: question.content,
            type: question.type,
            position: question.position,
          },
          question.id,
          [testId],
        );
      }),
      tapResponse(
        () => {
          this.patchState(({ loadingState }) => ({
            loadingState: loadingStateAdapter.taskFinished(loadingState),
          }));
        },
        (error) => {
          this.patchState(({ loadingState }) => ({
            error,
            loadingState: loadingStateAdapter.taskFinished(loadingState),
          }));
        },
      ),
    ),
  );

  readonly deleteQuestionFromDb = this.effect(
    (question$: Observable<Question>) =>
      question$.pipe(
        tap(() =>
          this.patchState(({ loadingState }) => ({
            loadingState: loadingStateAdapter.taskStarted(loadingState),
          })),
        ),
        concatMap((question) => {
          const testId = this.get((state) => state.test)?.id;

          if (!testId) {
            throw new Error(
              'Tried to delete a question without previously loading the test.',
            );
          }

          return this.questionsService.delete(question.id, [testId]);
        }),
        tapResponse(
          () => {
            this.patchState(({ loadingState }) => ({
              loadingState: loadingStateAdapter.taskFinished(loadingState),
            }));
          },
          (error) => {
            this.patchState(({ loadingState }) => ({
              error,
              loadingState: loadingStateAdapter.taskFinished(loadingState),
            }));
          },
        ),
      ),
  );

  readonly swapQuestionsOnDb = this.effect(
    (
      $: Observable<{
        from: Question;
        to: Question;
      }>,
    ) =>
      $.pipe(
        tap(() =>
          this.patchState(({ loadingState }) => ({
            loadingState: loadingStateAdapter.taskStarted(loadingState),
          })),
        ),
        concatMap(({ from: fromQuestion, to: toQuestion }) => {
          const testId = this.get((state) => state.test)?.id;

          if (!testId) {
            throw new Error(
              'Tried to swap questions without previously loading the test.',
            );
          }

          const questionsService = this.questionsService;

          return questionsService.swapPositions(
            testId,
            fromQuestion,
            toQuestion,
          );
        }),
        tapResponse(
          () => {
            this.patchState(({ loadingState }) => ({
              loadingState: loadingStateAdapter.taskFinished(loadingState),
            }));
          },
          (error) => {
            this.patchState(({ loadingState }) => ({
              error,
              loadingState: loadingStateAdapter.taskFinished(loadingState),
            }));
          },
        ),
      ),
  );

  readonly saveAnswerOnDb = this.effect(
    (payload$: Observable<AnswerActionPayload>) =>
      payload$.pipe(
        tap(() =>
          this.patchState(({ loadingState }) => ({
            loadingState: loadingStateAdapter.taskStarted(loadingState),
          })),
        ),
        concatMap(({ questionId, answer }) => {
          const testId = this.get((state) => state.test)?.id;

          if (!testId) {
            throw new Error(
              'Tried to save an answer without previously loading the test.',
            );
          }

          const answersService = this.answersService;

          return answersService.create(
            {
              content: answer.content,
              position: answer.position,
            },
            answer.id,
            [testId, questionId],
          );
        }),
        tapResponse(
          () => {
            this.patchState(({ loadingState }) => ({
              loadingState: loadingStateAdapter.taskFinished(loadingState),
            }));
          },
          (error) => {
            this.patchState(({ loadingState }) => ({
              error,
              loadingState: loadingStateAdapter.taskFinished(loadingState),
            }));
          },
        ),
      ),
  );

  readonly deleteAnswerFromDb = this.effect(
    (payload$: Observable<{ questionId: string; answerId: string }>) =>
      payload$.pipe(
        tap(() =>
          this.patchState(({ loadingState }) => ({
            loadingState: loadingStateAdapter.taskStarted(loadingState),
          })),
        ),
        concatMap(({ questionId, answerId }) => {
          const testId = this.get((state) => state.test)?.id;

          if (!testId) {
            throw new Error(
              'Tried to delete an answer without previously loading the test.',
            );
          }

          const answersService = this.answersService;
          const answer = this.answers()
            .get(questionId)
            ?.find((a) => a.id === answerId);

          return answersService.delete(answerId, [testId, questionId]);
        }),
        tapResponse(
          () => {
            this.patchState(({ loadingState }) => ({
              loadingState: loadingStateAdapter.taskFinished(loadingState),
            }));
          },
          (error) => {
            this.patchState(({ loadingState }) => ({
              error,
              loadingState: loadingStateAdapter.taskFinished(loadingState),
            }));
          },
        ),
      ),
  );

  readonly swapAnswersOnDb = this.effect(
    (
      $: Observable<{
        questionId: string;
        from: Answer;
        to: Answer;
      }>,
    ) =>
      $.pipe(
        tap(() =>
          this.patchState(({ loadingState }) => ({
            loadingState: loadingStateAdapter.taskStarted(loadingState),
          })),
        ),
        concatMap(({ questionId, from, to }) => {
          const testId = this.get((state) => state.test)?.id;

          if (!testId) {
            throw new Error(
              'Tried to swap answers without previously loading the test.',
            );
          }

          const answersService = this.answersService;

          return answersService.swapPositions(testId, questionId, from, to);
        }),
        tapResponse(
          () => {
            this.patchState(({ loadingState }) => ({
              loadingState: loadingStateAdapter.taskFinished(loadingState),
            }));
          },
          (error) => {
            this.patchState(({ loadingState }) => ({
              error,
              loadingState: loadingStateAdapter.taskFinished(loadingState),
            }));
          },
        ),
      ),
  );

  readonly updateAnswer = this.updater(
    (state, { questionId, answer }: { questionId: string; answer: Answer }) => {
      const newAnswer: Answer = {
        id: answer.id,
        content: answer.content,
        position: answer.position,
      };

      return {
        ...state,
        answers: new Map(state.answers).set(
          questionId,
          (state.answers.get(questionId) ?? []).map((a) =>
            a.id === answer.id ? newAnswer : a,
          ),
        ),
      };
    },
  );

  readonly deleteAnswer = this.updater(
    (state, payload: { questionId: string; answerId: string }) => {
      return {
        ...state,
        answers: new Map(state.answers).set(
          payload.questionId,
          (state.answers.get(payload.questionId) ?? []).filter(
            (answer) => answer.id !== payload.answerId,
          ),
        ),
      };
    },
  );

  readonly addAnswer = this.updater(
    (state, { questionId, answer }: { questionId: string; answer: Answer }) => {
      const newAnswer: Answer = {
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
    },
  );

  readonly swapAnswers = this.updater(
    (
      state,
      {
        questionId,
        from,
        to,
      }: {
        questionId: string;
        from: Answer;
        to: Answer;
      },
    ) => {
      return {
        ...state,
        answers: new Map(state.answers).set(
          questionId,
          this.swapPositionsById(
            [...(state.answers.get(questionId) ?? [])],
            [from.id, to.id],
            (answer, newPosition) => ({ ...answer, position: newPosition }),
          ),
        ),
      };
    },
  );

  readonly swapQuestions = this.updater(
    (state, { from, to }: { from: Question; to: Question }) => {
      return {
        ...state,
        questions: this.swapPositionsById(
          [...state.questions],
          [from.id, to.id],
          (question, newPosition) =>
            new Question({ ...question, position: newPosition }),
        ),
      };
    },
  );

  readonly deleteQuestion = this.updater((state, question: Question) => {
    return {
      ...state,
      questions: state.questions.filter((q) => q.id !== question.id),
    };
  });

  readonly addQuestion = this.updater((state, question: Question) => {
    return {
      ...state,
      questions: [...state.questions, question],
    };
  });

  /**
   * Updates the local question state.
   */
  readonly updateQuestion = this.updater((state, newQuestion: Question) => {
    const id = newQuestion.id;
    const questionIndex = state.questions.findIndex(
      (question) => question.id === id,
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
  });

  /**
   * Updates the test locally.
   */
  readonly updateTest = this.updater((state, test: Test) => {
    return {
      ...state,
      test,
    };
  });

  private swapPositionsById<
    T extends { id: string; position: number } & Record<string, any>,
  >(
    array: T[],
    ids: [string, string],
    constructor: (item: T, newPosition: number) => T,
  ) {
    const copyArray = [...array];
    const [id1, id2] = ids;
    const index1 = copyArray.findIndex((item) => item.id === id1);
    const index2 = copyArray.findIndex((item) => item.id === id2);

    if (index1 === -1 || index2 === -1) {
      throw new Error('Tried to swap items that do not exist');
    }

    const item1 = copyArray[index1];
    const item2 = copyArray[index2];

    copyArray[index1] = constructor(item2, item1.position);
    copyArray[index2] = constructor(item1, item2.position);

    return copyArray;
  }
}
