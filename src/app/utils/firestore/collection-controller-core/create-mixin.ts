import {
  DocumentData,
  DocumentReference,
  WithFieldValue,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap, take } from 'rxjs';
import { CollectionControllerMixinsBase } from './collection-controller-base';

export type CreateMethod<TData extends DocumentData> = {
  create(
    data: WithFieldValue<TData>,
    id?: string,
    params?: string[],
  ): Observable<DocumentReference<TData>>;
};

export function mixinCreate<
  TData extends DocumentData,
>() {
  return function <TBase extends CollectionControllerMixinsBase<TData>>(
    Base: TBase,
  ) {
    return class mixinCreate extends Base implements CreateMethod<TData> {
      create(
        data: WithFieldValue<TData>,
        id?: string,
        params: string[] = [],
      ): Observable<DocumentReference<TData>> {
        return this.getCollectionRef(params).pipe(
          switchMap((collectionRef) => {
            const docRef = id ? doc(collectionRef, id) : doc(collectionRef);

            return from(setDoc(docRef, data)).pipe(map(() => docRef));
          }),
          take(1),
        );
      }
    };
  };
}
