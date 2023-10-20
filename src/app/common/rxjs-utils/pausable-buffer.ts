import { bufferToggle, merge, mergeMap, Observable, windowToggle } from 'rxjs';

export function pauseableBuffer<T>(
  source$: Observable<T>,
  on$: Observable<void>,
  off$: Observable<void>
) {
  return merge(
    source$.pipe(bufferToggle(off$, () => on$)),
    source$.pipe(windowToggle(on$, () => off$))
  ).pipe(mergeMap((x) => x));
}
