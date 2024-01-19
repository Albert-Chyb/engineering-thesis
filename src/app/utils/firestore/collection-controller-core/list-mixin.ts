import {
  DocumentData,
  QueryConstraint,
  collectionData,
  getDocs,
  query,
} from '@angular/fire/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { CollectionControllerMixinsBase } from './collection-controller-base';

export type ListMethod<TData extends DocumentData> = {
  list(params: string[]): Observable<TData[]>;

  query(params: string[], ...filters: QueryConstraint[]): Observable<TData[]>;
};

export function mixinList<TData extends DocumentData>() {
  return function <TBase extends CollectionControllerMixinsBase<TData>>(
    Base: TBase,
  ) {
    return class extends Base implements ListMethod<TData> {
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

            return getDocs(q);
          }),
          map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data())),
        );
      }
    };
  };
}
