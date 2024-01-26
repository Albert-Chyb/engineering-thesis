import { DocumentData, docData } from '@angular/fire/firestore';
import { Observable, switchMap } from 'rxjs';
import {
  CollectionControllerMethod,
  CollectionControllerMixinsBase,
} from './collection-controller-base';

export type ReadMethod<TData extends DocumentData> = {
  read(id: string, params: string[]): Observable<TData | undefined>;
};

export function mixinRead<TData extends DocumentData>() {
  return function <TBase extends CollectionControllerMixinsBase<TData>>(
    Base: TBase,
  ) {
    return class extends Base implements ReadMethod<TData> {
      constructor(...args: any[]) {
        super(...args);

        this.markAs(CollectionControllerMethod.Read);
      }

      read(id: string, params: string[] = []) {
        return this.getDocRef(id, params).pipe(
          switchMap((docRef) => docData(docRef)),
        );
      }
    };
  };
}
