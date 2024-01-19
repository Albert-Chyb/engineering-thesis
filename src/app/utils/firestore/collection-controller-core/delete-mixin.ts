import { DocumentData, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, switchMap, take } from 'rxjs';
import { CollectionControllerMixinsBase } from './collection-controller-base';

export type DeleteMethod = {
  delete(id: string, params: string[]): Observable<void>;
};

export function mixinDelete<TData extends DocumentData>() {
  return function <TBase extends CollectionControllerMixinsBase<TData>>(
    Base: TBase,
  ) {
    return class extends Base implements DeleteMethod {
      delete(id: string, params: string[] = []): Observable<void> {
        return this.getDocRef(id, params).pipe(
          switchMap((docRef) => from(deleteDoc(docRef))),
          take(1),
        );
      }
    };
  };
}
