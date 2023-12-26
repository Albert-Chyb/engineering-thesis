import { Injectable, inject } from '@angular/core';
import { AnswersKeysService } from '@answers-keys/services/answers-keys.service';
import { AnswersKeys } from '@answers-keys/types/answers-keys';
import { SharedTestsService } from '@exam-session/services/shared-tests.service';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { AssembledTest } from '@test-creator/types/assembled-test';
import { PageStateIndicators } from '@utils/page-states/page-states-indicators';
import { Observable, combineLatest, concatMap, switchMap, tap } from 'rxjs';

const loadingAdapter = new LoadingStateAdapter();

interface AnswersKeysPageState {
  loadingState: LoadingState;
  sharedTest: AssembledTest | null;
  answersKeys: AnswersKeys | null;
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

  readonly isEmpty = this.selectSignal((state) => !state.sharedTest);

  readonly error = this.selectSignal((state) => state.error);

  readonly sharedTest = this.selectSignal((state) => state.sharedTest);

  readonly answersKeys = this.selectSignal((state) => state.answersKeys);

  readonly load = this.effect((sharedTestId$: Observable<string>) =>
    sharedTestId$.pipe(
      tap(() =>
        this.patchState((state) => ({
          loadingState: loadingAdapter.startLoading(state.loadingState),
        })),
      ),
      switchMap((sharedTestId) =>
        combineLatest({
          sharedTest: this.sharedTestsService.getSharedTest(sharedTestId),
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
    (answersKeys$: Observable<AnswersKeys>) =>
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
