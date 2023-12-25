import { Injectable, inject } from '@angular/core';
import { SharedTestsService } from '@exam-session/services/shared-tests.service';
import { SolvedTestsService } from '@exam-session/services/solved-tests.service';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { AssembledTest } from '@test-creator/types/assembled-test';
import { SolvedTestsAnswersService } from '@tests-grading/services/solved-tests-answers.service';
import { SolvedTest } from '@tests-grading/types/solved-test';
import { SolvedTestAnswers } from '@tests-grading/types/solved-test-answers';
import { SolvedTestAnswersEvaluations } from '@tests-grading/types/solved-test-answers-evaluations';
import { PageStateIndicators } from '@utils/page-states/page-states-indicators';
import { Observable, combineLatest, concatMap, switchMap, tap } from 'rxjs';

const loadingAdapter = new LoadingStateAdapter();

interface TestGradingPageState {
  loadingState: LoadingState;
  error: unknown;
  solvedTest: SolvedTest | null;
  solvedTestAnswers: SolvedTestAnswers | null;
  sharedTest: AssembledTest | null;
}

const INITIAL_STATE: TestGradingPageState = {
  loadingState: loadingAdapter.getInitialState(),
  error: null,
  solvedTestAnswers: null,
  solvedTest: null,
  sharedTest: null,
};

@Injectable()
export class TestGradingPageStore
  extends ComponentStore<TestGradingPageState>
  implements PageStateIndicators
{
  private readonly solvedTestsAnswers = inject(SolvedTestsAnswersService);
  private readonly solvedTests = inject(SolvedTestsService);
  private readonly sharedTests = inject(SharedTestsService);

  readonly sharedTest = this.selectSignal((state) => state.sharedTest);
  readonly solvedTest = this.selectSignal((state) => state.solvedTest);
  readonly solvedTestAnswers = this.selectSignal(
    (state) => state.solvedTestAnswers,
  );
  readonly isLoading = this.selectSignal((state) =>
    loadingAdapter.getSelectors().isLoading(state.loadingState),
  );
  readonly isPending = this.selectSignal((state) =>
    loadingAdapter.getSelectors().isPending(state.loadingState),
  );
  readonly isEmpty = this.selectSignal(
    (state) => !state.solvedTest && !state.solvedTestAnswers,
  );
  readonly error = this.selectSignal((state) => state.error);

  constructor() {
    super(INITIAL_STATE);
  }

  readonly load = this.effect(
    (ids$: Observable<{ sharedTestId: string; solvedTestId: string }>) =>
      ids$.pipe(
        tap(() =>
          this.patchState((state) => ({
            loadingState: loadingAdapter.startLoading(state.loadingState),
          })),
        ),
        switchMap(({ sharedTestId, solvedTestId }) =>
          combineLatest({
            solvedTest: this.solvedTests.get(sharedTestId, solvedTestId),
            solvedTestAnswers: this.solvedTestsAnswers.get(
              sharedTestId,
              solvedTestId,
            ),
            sharedTest: this.sharedTests.getSharedTest(sharedTestId),
          }),
        ),
        tapResponse(
          ({ solvedTestAnswers, solvedTest, sharedTest }) =>
            this.patchState((state) => ({
              solvedTestAnswers,
              solvedTest,
              sharedTest,
              loadingState: loadingAdapter.finishLoading(state.loadingState),
            })),
          (error) => {
            return this.patchState((state) => ({
              error,
              loadingState: loadingAdapter.finishLoading(state.loadingState),
            }));
          },
        ),
      ),
  );

  readonly evaluateAnswers = this.effect(
    (evaluations$: Observable<SolvedTestAnswersEvaluations>) =>
      evaluations$.pipe(
        tap(() =>
          this.patchState((state) => ({
            loadingState: loadingAdapter.taskStarted(state.loadingState),
          })),
        ),
        concatMap((evaluations) => {
          const solvedTestId = this.get((state) => state.solvedTest)?.id;
          const sharedTestId = this.get((state) => state.sharedTest)?.id;

          if (!solvedTestId || !sharedTestId) {
            throw new Error('Solved test id and shared test id are required');
          }

          return this.solvedTestsAnswers.evaluateAnswers(
            sharedTestId,
            solvedTestId,
            evaluations,
          );
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
