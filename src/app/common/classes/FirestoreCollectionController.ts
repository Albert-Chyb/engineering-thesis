import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QueryConstraint,
  UpdateData,
  WithFieldValue,
  deleteDoc,
  doc,
  docData,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap } from 'rxjs';

export class FirestoreCollectionController<
  TData extends DocumentData,
  TCreatePayload extends DocumentData
> {
  constructor(
    private readonly collectionRef$: Observable<CollectionReference<TData>>
  ) {}

  create(
    data: WithFieldValue<TCreatePayload>,
    id?: string
  ): Observable<DocumentReference<TData>> {
    return this.collectionRef$.pipe(
      switchMap((collectionRef) => {
        const docRef = id ? doc(collectionRef, id) : doc(collectionRef);

        return from(setDoc(docRef, data as any)).pipe(map(() => docRef));
      })
    );
  }

  read(id: string): Observable<TData | undefined> {
    return this.getDocRef(id).pipe(
      switchMap((docRef) => from(getDoc(docRef))),
      map((doc) => doc.data())
    );
  }

  readChanges(id: string): Observable<TData | undefined> {
    return this.getDocRef(id).pipe(switchMap((docRef) => docData(docRef)));
  }

  update(id: string, updatedData: UpdateData<TData>): Observable<void> {
    return this.getDocRef(id).pipe(
      switchMap((docRef) => from(updateDoc(docRef, updatedData)))
    );
  }

  delete(id: string): Observable<void> {
    return this.getDocRef(id).pipe(
      switchMap((docRef) => from(deleteDoc(docRef)))
    );
  }

  query(...filters: QueryConstraint[]): Observable<TData[]> {
    return this.collectionRef$.pipe(
      switchMap((collectionRef) => {
        const q = query(collectionRef, ...filters);

        return getDocs(q);
      }),
      map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data()))
    );
  }

  private getDocRef(id: string): Observable<DocumentReference<TData>> {
    return this.collectionRef$.pipe(
      map((collectionRef) => doc<TData>(collectionRef, id))
    );
  }
}
