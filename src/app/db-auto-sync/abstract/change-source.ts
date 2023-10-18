import { Observable } from 'rxjs';

export abstract class ChangeSource<TObj> {
  /**
   * Emits whenever the value changes.
   */
  abstract valueChanges: Observable<TObj>;

  /**
   * If the sync fails, this method is called to restore the lastly synced value.
   */
  abstract restoreValue(value: TObj): void;

  /**
   * The snapshot of the value of the source.
   * This value will be used if the very first change made inside the source fails.
   */
  abstract get value(): TObj;

  /**
   * This value will be passed to the local controller, if the collection sync is used.
   */
  abstract get forLocalController(): TObj;
}
