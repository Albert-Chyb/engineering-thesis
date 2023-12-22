import { Injectable, inject } from '@angular/core';
import { SolvedTestsService } from '@exam-session/services/solved-tests.service';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { SolvedTest } from '@tests-grading/types/solved-test';
import { Observable, switchMap, tap } from 'rxjs';

const loadingStateAdapter = new LoadingStateAdapter();

type SubmittedSolutionsPageState = {
  solvedTests: SolvedTest[];
  loadingState: LoadingState;
  error: unknown;
};

const INITIAL_STATE: SubmittedSolutionsPageState = {
  solvedTests: [],
  loadingState: loadingStateAdapter.getInitialState(),
  error: null,
};

@Injectable()
export class SubmittedSolutionsPageStore extends ComponentStore<SubmittedSolutionsPageState> {
  private readonly solvedTestsService = inject(SolvedTestsService);

  constructor() {
    super(INITIAL_STATE);
  }

  readonly solvedTests = this.selectSignal((state) => state.solvedTests);
  readonly error = this.selectSignal((state) => state.error);
  readonly pendingState$ = this.select({
    isPending: this.select((state) =>
      loadingStateAdapter.getSelectors().isPending(state.loadingState),
    ),
  });

  readonly load = this.effect((sharedTestId$: Observable<string>) =>
    sharedTestId$.pipe(
      tap(() =>
        this.patchState((state) => ({
          loadingState: loadingStateAdapter.startLoading(state.loadingState),
        })),
      ),
      switchMap((sharedTestId) => this.solvedTestsService.list(sharedTestId)),
      tapResponse(
        (solvedTests) =>
          this.patchState((state) => ({
            solvedTests,
            loadingState: loadingStateAdapter.finishLoading(state.loadingState),
          })),
        (error) =>
          this.patchState((state) => ({
            error,
            loadingState: loadingStateAdapter.finishLoading(state.loadingState),
          })),
      ),
    ),
  );
}
