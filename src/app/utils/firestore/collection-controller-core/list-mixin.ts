import {
  DocumentData,
  QueryConstraint,
  collectionData,
  query,
} from '@angular/fire/firestore';
import { Observable, switchMap } from 'rxjs';
import {
  CollectionControllerMethod,
  CollectionControllerMixinsBase,
} from './collection-controller-base';

export type ListMethod<TData extends DocumentData> = {
  list(params: string[]): Observable<TData[]>;

  query(params: string[], ...filters: QueryConstraint[]): Observable<TData[]>;
};

export function mixinList<TData extends DocumentData>() {
  return function <TBase extends CollectionControllerMixinsBase<TData>>(
    Base: TBase,
  ) {
    return class extends Base implements ListMethod<TData> {
      constructor(...args: any[]) {
        super(...args);

        this.markAs(CollectionControllerMethod.List);
      }

      list(params: string[] = []): Observable<TData[]> {
        return this.getCollectionRef(params).pipe(
          switchMap((collectionRef) => collectionData(collectionRef)),
        );
      }

      query(
        params: string[] = [],
        ...filters: QueryConstraint[]
      ): Observable<TData[]> {
        return this.getCollectionRef(params).pipe(
          switchMap((collectionRef) => {
            const q = query(collectionRef, ...filters);

            return collectionData(q);
          }),
        );
      }
    };
  };
}
