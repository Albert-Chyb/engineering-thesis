import { Injectable } from '@angular/core';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore } from '@ngrx/component-store';
import { SolvedTest } from '@tests-grading/types/solved-test';

const loadingStateAdapter = new LoadingStateAdapter();

type SubmittedSolutionsPageState = {
  solvedTests: SolvedTest[];
  loadingState: LoadingState;
};

const INITIAL_STATE: SubmittedSolutionsPageState = {
  solvedTests: [],
  loadingState: loadingStateAdapter.getInitialState(),
};

@Injectable()
export class SubmittedSolutionsPageStore extends ComponentStore<SubmittedSolutionsPageState> {
  constructor() {
    super(INITIAL_STATE);
  }
}
