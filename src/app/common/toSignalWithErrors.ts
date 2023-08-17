import { Signal, computed } from '@angular/core';
import { ToSignalOptions, toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of } from 'rxjs';

export function toSignalWithErrors<T>(
  observable$: Observable<T>,
  options?: ToSignalOptions<undefined> & { requireSync?: false }
): {
  data: Signal<T | undefined>;
  error: Signal<unknown>;
} {
  const source = toSignal(
    observable$.pipe(
      map((data) => ({ data, error: undefined })),
      catchError((error) => of({ data: undefined, error }))
    ),
    {
      ...options,
      initialValue: { data: undefined, error: undefined },
    }
  );

  const data = computed(() => source().data);
  const error = computed(() => source().error);

  return {
    data,
    error,
  };
}
