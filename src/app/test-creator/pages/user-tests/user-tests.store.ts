import { Injectable, inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { Test } from '@test-creator/types/test';
import { SharedTestsMetadataService } from '@tests-sharing/services/shared-tests-metadata.service';
import { ShareTestCloudFnPayload } from '@tests-sharing/types/share-test-cloud-fn';
import { LoadingState } from '@utils/loading-indicator/ngrx/LoadingState';
import { LoadingStateAdapter } from '@utils/loading-indicator/ngrx/LoadingStateAdapter';
import { PageStateIndicators } from '@utils/page-states/page-states-indicators';
import { Observable, mergeMap, switchMap, tap } from 'rxjs';

const loadingAdapter = new LoadingStateAdapter();

interface UserTestsState extends LoadingState {
  tests: Test[];
  error: any;
}

const INITIAL_STATE: UserTestsState = {
  ...loadingAdapter.getInitialState(),
  tests: [],
  error: null,
};

@Injectable()
export class UserTestsStore
  extends ComponentStore<UserTestsState>
  implements PageStateIndicators
{
  private readonly userTests = inject(UserTestsService);
  private readonly sharedTests = inject(SharedTestsMetadataService);

  readonly tests = this.selectSignal((state) => state.tests);

  readonly error = this.selectSignal((state) => state.error);

  readonly isLoading = this.selectSignal(
    loadingAdapter.getSelectors().isLoading,
  );

  readonly isPending = this.selectSignal(
    loadingAdapter.getSelectors().isPending,
  );

  readonly isEmpty = this.selectSignal((state) => state.tests.length === 0);

  readonly tasksCount = this.selectSignal(
    loadingAdapter.getSelectors().tasksCount,
  );

  constructor() {
    super(INITIAL_STATE);
  }

  readonly load = this.effect(($) =>
    $.pipe(
      tap(() => this.patchState((state) => loadingAdapter.startLoading(state))),
      switchMap(() => this.userTests.list().pipe()),
      tapResponse(
        (tests) => {
          return this.patchState((state) => ({
            ...loadingAdapter.finishLoading(state),
            tests,
          }));
        },
        (error) =>
          this.patchState((state) => ({
            ...loadingAdapter.finishLoading(state),
            error,
          })),
      ),
    ),
  );

  readonly shareTest = this.effect(
    (testId$: Observable<ShareTestCloudFnPayload>) =>
      testId$.pipe(
        tap(() =>
          this.patchState((state) => loadingAdapter.taskStarted(state)),
        ),
        mergeMap((testId) => {
          return this.sharedTests.shareTest(testId).pipe(
            tapResponse(
              () => {
                this.patchState((state) => ({
                  ...loadingAdapter.taskFinished(state),
                }));
              },
              (error) => {
                this.patchState((state) => ({
                  ...loadingAdapter.taskFinished(state),
                  error,
                }));
              },
            ),
          );
        }),
      ),
  );

  readonly delete = this.effect((testId$: Observable<string>) =>
    testId$.pipe(
      tap(() => this.patchState((state) => loadingAdapter.taskStarted(state))),
      mergeMap((testId) => {
        const test = this.get((state) => {
          return state.tests.find((t) => t.id === testId);
        });

        if (!test) {
          throw new Error('Test not found');
        }

        this._delete(testId);

        return this.userTests.delete(testId).pipe(
          tapResponse(
            () => {
              this.patchState((state) => ({
                ...loadingAdapter.taskFinished(state),
              }));
            },
            (error) => {
              this._add(test);

              this.patchState((state) => ({
                ...loadingAdapter.taskFinished(state),
                error,
              }));
            },
          ),
        );
      }),
    ),
  );

  readonly create = this.effect((test$: Observable<Test>) =>
    test$.pipe(
      tap(() => this.patchState((state) => loadingAdapter.taskStarted(state))),
      tap((test) => this._add(test)),
      mergeMap((test) =>
        this.userTests.create({ name: test.name }, test.id).pipe(
          tapResponse(
            () => {
              this.patchState((state) => ({
                ...loadingAdapter.taskFinished(state),
              }));
            },
            (error) => {
              this._delete(test.id);

              this.patchState((state) => ({
                ...loadingAdapter.taskFinished(state),
                error,
              }));
            },
          ),
        ),
      ),
    ),
  );

  private _delete = this.updater((state, testId: string) => ({
    ...state,
    tests: state.tests.filter((test) => test.id !== testId),
  }));

  private _add = this.updater((state, test: Test) => ({
    ...state,
    tests: [...state.tests, test],
  }));
}
