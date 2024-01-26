import { Injectable, computed, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Question } from '@test-creator/classes/question';
import { AnswersKeysService } from '@utils/firestore/collections-controllers/answers-keys.service';
import { SharedTestsService } from '@utils/firestore/collections-controllers/shared-tests.service';
import { SharedTest } from '@utils/firestore/models/shared-tests.model';
import { UserAnswers } from '@utils/firestore/models/user-answers.model';
import { LoadingState } from '@utils/loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@utils/loading-indicator/ngrx/LoadingStateAdapter';
import { PageStateIndicators } from '@utils/page-states/page-states-indicators';
import { Observable, combineLatest, concatMap, switchMap, tap } from 'rxjs';

const loadingAdapter = new LoadingStateAdapter();

interface AnswersKeysPageState {
  loadingState: LoadingState;
  sharedTest: SharedTest | null;
  answersKeys: UserAnswers | null;
  error: unknown;
}

const INITIAL_STATE: AnswersKeysPageState = {
  loadingState: loadingAdapter.getInitialState(),
  sharedTest: null,
  error: null,
  answersKeys: null,
};

@Injectable()
export class AnswersKeysPageStore
  extends ComponentStore<AnswersKeysPageState>
  implements PageStateIndicators
{
  private readonly sharedTestsService = inject(SharedTestsService);
  private readonly answersKeysService = inject(AnswersKeysService);

  constructor() {
    super(INITIAL_STATE);
  }

  readonly isLoading = this.selectSignal((state) =>
    loadingAdapter.getSelectors().isLoading(state.loadingState),
  );

  readonly isPending = this.selectSignal((state) =>
    loadingAdapter.getSelectors().isPending(state.loadingState),
  );

  readonly isEmpty = computed(() => this.questions().length === 0);

  readonly error = this.selectSignal((state) => state.error);

  readonly sharedTest = this.selectSignal((state) => state.sharedTest);

  readonly answersKeys = this.selectSignal((state) => state.answersKeys);

  readonly questions = computed(() => {
    const sharedTest = this.sharedTest();

    return (
      sharedTest?.questions.filter((question) =>
        Question.getClosedQuestionsTypes().includes(question.type as any),
      ) ?? []
    );
  });

  readonly load = this.effect((sharedTestId$: Observable<string>) =>
    sharedTestId$.pipe(
      tap(() =>
        this.patchState((state) => ({
          loadingState: loadingAdapter.startLoading(state.loadingState),
        })),
      ),
      switchMap((sharedTestId) =>
        combineLatest({
          sharedTest: this.sharedTestsService.read(sharedTestId),
          answersKeys: this.answersKeysService.read(sharedTestId),
        }),
      ),
      tapResponse(
        ({ sharedTest, answersKeys }) =>
          this.patchState((state) => ({
            loadingState: loadingAdapter.finishLoading(state.loadingState),
            sharedTest,
            answersKeys,
          })),
        (error) =>
          this.patchState((state) => ({
            loadingState: loadingAdapter.finishLoading(state.loadingState),
            error,
          })),
      ),
    ),
  );

  readonly saveAnswersKeys = this.effect(
    (answersKeys$: Observable<UserAnswers>) =>
      answersKeys$.pipe(
        tap(() =>
          this.patchState((state) => ({
            loadingState: loadingAdapter.taskStarted(state.loadingState),
          })),
        ),
        concatMap((answersKeys) => {
          const sharedTestId = this.get((state) => state.sharedTest?.id);

          if (!sharedTestId) {
            throw new Error('Shared test id is not defined');
          }

          return this.answersKeysService.create(sharedTestId, answersKeys);
        }),
        tapResponse(
          () =>
            this.patchState((state) => ({
              loadingState: loadingAdapter.taskFinished(state.loadingState),
            })),
          (error) =>
            this.patchState((state) => ({
              loadingState: loadingAdapter.taskFinished(state.loadingState),
              error,
            })),
        ),
      ),
  );
}
