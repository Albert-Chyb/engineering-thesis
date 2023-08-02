import { Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of } from 'rxjs';

export function toSignalWithErrors<T>(observable$: Observable<T>): {
  data: Signal<T | undefined | null>;
  error: Signal<any>;
} {
  const source = toSignal(
    observable$.pipe(
      map((data) => ({ data, error: null })),
      catchError((error) => of({ data: null, error }))
    )
  );

  const data = computed(() => source()?.data);
  const error = computed(() => source()?.error);

  return {
    data,
    error,
  };
}
