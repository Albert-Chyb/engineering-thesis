import { Injectable, Signal } from '@angular/core';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore } from '@ngrx/component-store';
import { SolvedTest } from '@tests-grading/types/solved-test';
import { PageStateIndicators } from '@utils/page-states/page-states-indicators';

const loadingStateAdapter = new LoadingStateAdapter();

interface SubmissionsListComponentState {
  loadingState: LoadingState;
  error: unknown;
  submissions: SolvedTest[];
}

const INITIAL_STATE: SubmissionsListComponentState = {
  loadingState: loadingStateAdapter.getInitialState(),
  error: null,
  submissions: [],
};

@Injectable()
export class SubmissionsListComponentStore
  extends ComponentStore<SubmissionsListComponentState>
  implements PageStateIndicators
{
  constructor() {
    super(INITIAL_STATE);
  }

  readonly isLoading: Signal<boolean> = this.selectSignal((state) =>
    loadingStateAdapter.getSelectors().isLoading(state.loadingState),
  );

  readonly isPending: Signal<boolean> = this.selectSignal((state) =>
    loadingStateAdapter.getSelectors().isPending(state.loadingState),
  );

  readonly isEmpty: Signal<boolean> = this.selectSignal(
    (state) => state.submissions.length === 0,
  );

  readonly error: Signal<unknown> = this.selectSignal((state) => state.error);
}
