import { DocumentData, UpdateData, updateDoc } from '@angular/fire/firestore';
import { Observable, from, switchMap, take } from 'rxjs';
import {
  CollectionControllerMethod,
  CollectionControllerMixinsBase,
} from './collection-controller-base';

export type UpdateMethod<TData extends DocumentData> = {
  update(
    id: string,
    updatedData: UpdateData<TData>,
    params: string[],
  ): Observable<void>;
};

export function mixinUpdate<TData extends DocumentData>() {
  return function <TBase extends CollectionControllerMixinsBase<TData>>(
    Base: TBase,
  ) {
    return class extends Base implements UpdateMethod<TData> {
      constructor(...args: any[]) {
        super(...args);

        this.markAs(CollectionControllerMethod.Update);
      }

      update(
        id: string,
        updatedData: UpdateData<TData>,
        params: string[] = [],
      ): Observable<void> {
        return this.getDocRef(id, params).pipe(
          switchMap((docRef) => from(updateDoc(docRef, updatedData))),
          take(1),
        );
      }
    };
  };
}
