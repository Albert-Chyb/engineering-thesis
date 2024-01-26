import {
  DocumentData,
  DocumentReference,
  WithFieldValue,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap, take } from 'rxjs';
import {
  CollectionControllerMethod,
  CollectionControllerMixinsBase,
} from './collection-controller-base';

export type CreateMethod<
  TData extends DocumentData,
  TCreatePayload extends DocumentData,
> = {
  create(
    data: WithFieldValue<TCreatePayload>,
    id?: string,
    params?: string[],
  ): Observable<DocumentReference<TData>>;
};

export function mixinCreate<
  TData extends DocumentData,
  TCreatePayload extends DocumentData,
>() {
  return function <TBase extends CollectionControllerMixinsBase<TData>>(
    Base: TBase,
  ) {
    return class mixinCreate
      extends Base
      implements CreateMethod<TData, TCreatePayload>
    {
      constructor(...args: any[]) {
        super(...args);

        this.markAs(CollectionControllerMethod.Delete);
      }

      create(
        data: WithFieldValue<TCreatePayload>,
        id?: string,
        params: string[] = [],
      ): Observable<DocumentReference<TData>> {
        return this.getCollectionRef(params).pipe(
          switchMap((collectionRef) => {
            const docRef = id ? doc(collectionRef, id) : doc(collectionRef);

            return from(setDoc(docRef, data as any)).pipe(map(() => docRef));
          }),
          take(1),
        );
      }
    };
  };
}
