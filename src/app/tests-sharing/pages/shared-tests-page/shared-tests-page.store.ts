import { Injectable } from '@angular/core';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore } from '@ngrx/component-store';
import { SharedTest } from '@tests-sharing/types/shared-test';

const loadingStateAdapter = new LoadingStateAdapter();

export interface SharedTestsPageState {
  tests: SharedTest[];
  error: any;
  loadingState: LoadingState;
}

const INITIAL_STATE: SharedTestsPageState = {
  tests: [],
  error: null,
  loadingState: loadingStateAdapter.getInitialState(),
};

@Injectable()
export class SharedTestsPageStore extends ComponentStore<SharedTestsPageState> {
  constructor() {
    super(INITIAL_STATE);
  }

  readonly isLoading$ = this.selectSignal((state) =>
    loadingStateAdapter.getSelectors().isLoading(state.loadingState)
  );

  readonly isPending$ = this.select({
    isPending: this.select((state) =>
      loadingStateAdapter.getSelectors().isPending(state.loadingState)
    ),
  });
}
