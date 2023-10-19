import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  QueryConstraint,
  Transaction,
  UpdateData,
  WithFieldValue,
  collection,
  deleteDoc,
  doc,
  docData,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap, take } from 'rxjs';

export class FirestoreCollectionController<
  TData extends DocumentData,
  TCreatePayload extends DocumentData
> {
  constructor(
    private readonly firestore: Firestore,
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
      }),
      take(1)
    );
  }

  read(id: string): Observable<TData | undefined> {
    return this.getDocRef(id).pipe(
      switchMap((docRef) => from(getDoc(docRef))),
      map((doc) => doc.data()),
      take(1)
    );
  }

  readAll(): Observable<TData[]> {
    return this.collectionRef$.pipe(
      switchMap((collectionRef) => from(getDocs(collectionRef))),
      map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data()))
    );
  }

  readSnapshot(id: string): Observable<DocumentSnapshot<TData>> {
    return this.getDocRef(id).pipe(
      switchMap((docRef) => from(getDoc(docRef))),
      take(1)
    );
  }

  readChanges(id: string): Observable<TData | undefined> {
    return this.getDocRef(id).pipe(switchMap((docRef) => docData(docRef)));
  }

  update(id: string, updatedData: UpdateData<TData>): Observable<void> {
    return this.getDocRef(id).pipe(
      switchMap((docRef) => from(updateDoc(docRef, updatedData))),
      take(1)
    );
  }

  delete(id: string): Observable<void> {
    return this.getDocRef(id).pipe(
      switchMap((docRef) => from(deleteDoc(docRef))),
      take(1)
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

  generateId(): string {
    const fakeCollection = collection(this.firestore, 'fake');
    const fakeDoc = doc(fakeCollection);

    return fakeDoc.id;
  }

  transaction<TTransactionReturnData>(
    transactionFn: (transaction: Transaction) => Promise<TTransactionReturnData>
  ): Observable<TTransactionReturnData> {
    return from(runTransaction(this.firestore, transactionFn)).pipe(take(1));
  }

  private getDocRef(id: string): Observable<DocumentReference<TData>> {
    return this.collectionRef$.pipe(
      map((collectionRef) => doc<TData>(collectionRef, id))
    );
  }
}
