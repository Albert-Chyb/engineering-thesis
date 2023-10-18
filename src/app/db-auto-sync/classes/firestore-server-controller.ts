import { DocumentData } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { FirestoreCollectionController } from '@common/classes/FirestoreCollectionController';
import { ServerController } from '@db-auto-sync/abstract/server-controller';
import { EMPTY, Observable, map } from 'rxjs';

export class FirestoreServerController<
  TData extends DocumentData,
  TRawData extends DocumentData,
  TFormGroup extends FormGroup
> extends ServerController<TFormGroup> {
  constructor(
    private readonly controller: FirestoreCollectionController<TData, TRawData>
  ) {
    super();
  }

  override set(obj: TFormGroup, id?: string): Observable<void> {
    if (!obj.valid) {
      throw new Error(
        'Cannot set an object in the database with invalid data.'
      );
    }

    const value = obj.value as TRawData;

    return this.controller.create(value, id).pipe(map(() => undefined));
  }

  override delete(id: string): Observable<void> {
    return this.controller.delete(id);
  }

  override swap(id1: string, id2: string): Observable<void> {
    return EMPTY;
  }
}
