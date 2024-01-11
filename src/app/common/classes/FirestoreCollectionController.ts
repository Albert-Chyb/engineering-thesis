import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  FirestoreDataConverter,
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
  TRawData extends DocumentData,
> {
  constructor(
    protected readonly firestore: Firestore,
    private readonly collectionPathTemplate: Observable<string>,
    private readonly converter: FirestoreDataConverter<TData>,
  ) {}

  create(
    data: WithFieldValue<TRawData>,
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

  read(id: string, params: string[] = []): Observable<TData | undefined> {
    return this.getDocRef(id, params).pipe(
      switchMap((docRef) => from(getDoc(docRef))),
      map((doc) => doc.data()),
      take(1),
    );
  }

  readSnapshot(
    id: string,
    params: string[] = [],
  ): Observable<DocumentSnapshot<TData>> {
    return this.getDocRef(id, params).pipe(
      switchMap((docRef) => from(getDoc(docRef))),
      take(1),
    );
  }

  readChanges(
    id: string,
    params: string[] = [],
  ): Observable<TData | undefined> {
    return this.getDocRef(id, params).pipe(
      switchMap((docRef) => docData(docRef)),
    );
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

  delete(id: string, params: string[] = []): Observable<void> {
    return this.getDocRef(id, params).pipe(
      switchMap((docRef) => from(deleteDoc(docRef))),
      take(1),
    );
  }

  list(params: string[] = []): Observable<TData[]> {
    return this.getCollectionRef(params).pipe(
      switchMap((collectionRef) => getDocs(collectionRef)),
      map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data())),
      take(1),
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

  generateId(): string {
    const fakeCollection = collection(this.firestore, 'fake');
    const fakeDoc = doc(fakeCollection);

    return fakeDoc.id;
  }

  transaction<TTransactionReturnData>(
    transactionFn: (
      transaction: Transaction,
    ) => Promise<TTransactionReturnData>,
  ): Observable<TTransactionReturnData> {
    return from(runTransaction(this.firestore, transactionFn)).pipe(take(1));
  }

  private buildPath(pathParams: string[]): Observable<string> {
    const pathParamsCopy = [...pathParams];

    return this.collectionPathTemplate.pipe(
      map((template) =>
        template.replace(/{([^}]+)}/g, (_, paramName) => {
          const paramValue = pathParamsCopy.shift();

          if (!paramValue) {
            throw new Error(
              `The path template "${template}" requires more parameters than were provided.`,
            );
          }

          return paramValue;
        }),
      ),
    );
  }

  protected getCollectionRef(
    params: string[],
  ): Observable<CollectionReference<TData>> {
    return this.buildPath(params).pipe(
      map((path) =>
        collection(this.firestore, path).withConverter(this.converter),
      ),
    );
  }

  protected getDocRef(
    docId: string,
    params: string[],
  ): Observable<DocumentReference<TData>> {
    return this.getCollectionRef(params).pipe(
      map((collectionRef) => doc(collectionRef, docId)),
    );
  }
}
