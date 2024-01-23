import { Injectable, inject, signal } from '@angular/core';
import { SolvedTestFormValue } from '@exam-session/types/solved-test-form-value';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { SharedTestsMetadataService } from '@utils/firestore/collections-controllers/shared-tests-metadata.service';
import { SharedTestsService } from '@utils/firestore/collections-controllers/shared-tests.service';
import { SolvedTestsService } from '@utils/firestore/collections-controllers/solved-tests.service';
import { SharedTestMetadata } from '@utils/firestore/models/shared-test-metadata.model';
import { SharedTest } from '@utils/firestore/models/shared-tests.model';
import { LoadingState } from '@utils/loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@utils/loading-indicator/ngrx/LoadingStateAdapter';
import { PageStateIndicators } from '@utils/page-states/page-states-indicators';
import { Observable, combineLatest, exhaustMap, switchMap, tap } from 'rxjs';

const loadingStateAdapter = new LoadingStateAdapter();

interface ExamSessionPageState {
  metadata: SharedTestMetadata | null;
  test: SharedTest | null;
  error: any;
  loadingState: LoadingState;
  isSaved: boolean;
}

const INITIAL_STATE: ExamSessionPageState = {
  metadata: null,
  test: null,
  error: null,
  loadingState: loadingStateAdapter.getInitialState(),
  isSaved: false,
};

@Injectable()
export class ExamSessionPageStore
  extends ComponentStore<ExamSessionPageState>
  implements PageStateIndicators
{
  private readonly sharedTests = inject(SharedTestsService);
  private readonly sharedTestsMetadata = inject(SharedTestsMetadataService);
  private readonly solvedTests = inject(SolvedTestsService);

  readonly error = this.selectSignal((state) => state.error);
  readonly metadata = this.selectSignal((state) => state.metadata);
  readonly test = this.selectSignal((state) => state.test);
  readonly isSaved = this.selectSignal((state) => state.isSaved);

  readonly isLoading = this.selectSignal((state) =>
    loadingStateAdapter.getSelectors().isLoading(state.loadingState),
  );

  readonly isPending = this.selectSignal((state) =>
    loadingStateAdapter.getSelectors().isPending(state.loadingState),
  );

  readonly isEmpty = signal(false).asReadonly();

  constructor() {
    super(INITIAL_STATE);
  }

  readonly load = this.effect((id$: Observable<string>) =>
    id$.pipe(
      tap(() =>
        this.patchState((state) => ({
          loadingState: loadingStateAdapter.startLoading(state.loadingState),
        })),
      ),
      switchMap((id) =>
        combineLatest({
          metadata: this.sharedTestsMetadata.read(id),
          test: this.sharedTests.read(id),
        }),
      ),
      tapResponse(
        (data) =>
          this.patchState((state) => ({
            metadata: data.metadata,
            test: data.test,
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

  readonly saveSolvedTest = this.effect(
    (test$: Observable<SolvedTestFormValue>) =>
      test$.pipe(
        tap(() =>
          this.patchState((state) => ({
            loadingState: loadingStateAdapter.taskStarted(state.loadingState),
          })),
        ),
        exhaustMap((test) => {
          const sharedTestId = this.get((state) => state.test?.id);

          if (!sharedTestId) {
            throw new Error(
              `Cannot save the solved test because the test is not loaded.`,
            );
          }

          return this.solvedTests.saveSolvedTest(sharedTestId, test);
        }),
        tapResponse(
          () =>
            this.patchState((state) => ({
              isSaved: true,
              loadingState: loadingStateAdapter.taskFinished(
                state.loadingState,
              ),
            })),
          (error) =>
            this.patchState((state) => ({
              error,
              loadingState: loadingStateAdapter.taskFinished(
                state.loadingState,
              ),
            })),
        ),
      ),
  );
}
