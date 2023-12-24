import { Injectable } from '@angular/core';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore } from '@ngrx/component-store';

const loadingAdapter = new LoadingStateAdapter();

interface TestGradingPageState {
  loadingState: LoadingState;
}

const INITIAL_STATE: TestGradingPageState = {
  loadingState: loadingAdapter.getInitialState(),
};

@Injectable()
export class TestGradingPageStore extends ComponentStore<TestGradingPageState> {
  constructor() {
    super(INITIAL_STATE);
  }
}
