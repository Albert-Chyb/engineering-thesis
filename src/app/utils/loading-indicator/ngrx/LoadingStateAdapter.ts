import { LoadingState } from './LoadingState';

export class LoadingStateAdapter {
  getInitialState(): LoadingState {
    return {
      isLoading: true,
      tasksCount: 0,
    };
  }

  startLoading(oldState: LoadingState): LoadingState {
    return {
      ...oldState,
      isLoading: true,
    };
  }

  finishLoading(oldState: LoadingState): LoadingState {
    return {
      ...oldState,
      isLoading: false,
    };
  }

  taskStarted(oldState: LoadingState): LoadingState {
    const futureState = {
      ...oldState,
      tasksCount: oldState.tasksCount + 1,
    };

    this.validateState(futureState, oldState);

    return futureState;
  }

  taskFinished(oldState: LoadingState): LoadingState {
    const futureState = {
      ...oldState,
      tasksCount: oldState.tasksCount - 1,
    };

    this.validateState(futureState, oldState);

    return futureState;
  }

  getSelectors() {
    return {
      isLoading: (state: LoadingState) => state.isLoading,
      isPending: (state: LoadingState) => state.tasksCount > 0,
      tasksCount: (state: LoadingState) => state.tasksCount,
    };
  }

  private validateState(
    futureState: LoadingState,
    oldState: LoadingState
  ): void {
    // If tasksCount is below 0, then the user has called taskFinished more times than taskStarted.
    if (futureState.tasksCount < 0) {
      throw new Error(
        'Invalid state: tasksCount is below 0. This means that taskFinished has been called more times than taskStarted.'
      );
    }

    // The tasksCount cannot be incremented or decremented by more than 1.
    if (Math.abs(futureState.tasksCount - oldState.tasksCount) > 1) {
      throw new Error(
        'Invalid state: tasksCount has been incremented by more than 1.'
      );
    }
  }
}
