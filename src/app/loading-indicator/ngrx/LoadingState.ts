export interface LoadingState {
  /** A property that is meant to indicate that the whole state awaits new set of data. */
  isLoading: boolean;

  /** Total count of async tasks that await completions. */
  tasksCount: number;
}
