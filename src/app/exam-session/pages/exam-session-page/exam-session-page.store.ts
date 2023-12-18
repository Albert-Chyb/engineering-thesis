import { Injectable } from '@angular/core';
import { LoadingState } from '@loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@loading-indicator/ngrx/LoadingStateAdapter';
import { ComponentStore } from '@ngrx/component-store';
import { AssembledTest } from '@test-creator/types/assembled-test';
import { SharedTestMetadata } from '@tests-sharing/types/shared-test';

const loadingStateAdapter = new LoadingStateAdapter();

interface ExamSessionPageState {
  metadata: SharedTestMetadata | null;
  test: AssembledTest | null;
  error: any;
  loadingState: LoadingState;
}

const INITIAL_STATE: ExamSessionPageState = {
  metadata: null,
  test: null,
  error: null,
  loadingState: loadingStateAdapter.getInitialState(),
};

@Injectable()
export class ExamSessionPageStore extends ComponentStore<ExamSessionPageState> {
  constructor() {
    super(INITIAL_STATE);
  }
}
