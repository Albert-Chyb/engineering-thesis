import { Injectable } from '@angular/core';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore } from '@ngrx/component-store';
import { SolvedTest } from '@tests-grading/types/solved-test';

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
  constructor() {
    super(INITIAL_STATE);
  }

  readonly error = this.selectSignal((state) => state.error);
  readonly pendingState$ = this.select({
    isPending: this.select((state) =>
      loadingStateAdapter.getSelectors().isPending(state.loadingState),
    ),
  });
}
