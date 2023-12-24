import { Injectable, inject } from '@angular/core';
import { SolvedTestsService } from '@exam-session/services/solved-tests.service';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { SolvedTestsAnswersService } from '@tests-grading/services/solved-tests-answers.service';
import { SolvedTest } from '@tests-grading/types/solved-test';
import { SolvedTestAnswers } from '@tests-grading/types/solved-test-answers';
import { Observable, combineLatest, switchMap, tap } from 'rxjs';

const loadingAdapter = new LoadingStateAdapter();

interface TestGradingPageState {
  loadingState: LoadingState;
  error: unknown;
  solvedTest: SolvedTest | null;
  solvedTestAnswers: SolvedTestAnswers | null;
}

const INITIAL_STATE: TestGradingPageState = {
  loadingState: loadingAdapter.getInitialState(),
  error: null,
  solvedTestAnswers: null,
  solvedTest: null,
};

@Injectable()
export class TestGradingPageStore extends ComponentStore<TestGradingPageState> {
  private readonly solvedTestsAnswers = inject(SolvedTestsAnswersService);
  private readonly solvedTests = inject(SolvedTestsService);

  readonly solvedTest = this.selectSignal((state) => state.solvedTest);
  readonly solvedTestAnswers = this.selectSignal(
    (state) => state.solvedTestAnswers,
  );

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
          }),
        ),
        tapResponse(
          ({ solvedTestAnswers, solvedTest }) =>
            this.patchState((state) => ({
              solvedTestAnswers,
              solvedTest,
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
}
