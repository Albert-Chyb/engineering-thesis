import { Signal, computed, signal } from '@angular/core';
import { ToSignalOptions, toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of } from 'rxjs';

export function toSignalWithErrors<T>(
  observable$: Observable<T>,
  options?: ToSignalOptions<undefined> & { requireSync?: false }
): {
  data: Signal<T | undefined | null>;
  error: Signal<any>;
} {
  const source = toSignal(
    observable$.pipe(
      map((data) => ({ data, error: null })),
      catchError((error) => of({ data: null, error }))
    ),
    options
  );

  const data = computed(() => source()?.data);
  const error = computed(() => source()?.error);
    
  return {
    data,
    error,
  };
}

/**
 * A helper object for the initial value of a signal.
 */
export const INITIAL_MODEL = {
  data: signal(null) as Signal<null>,
  error: signal(null) as Signal<null>,
};
