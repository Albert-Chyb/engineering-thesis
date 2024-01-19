import { inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  Transaction,
  collection,
  doc,
  runTransaction,
} from '@angular/fire/firestore';
import { Observable, from, map, take } from 'rxjs';

export abstract class CollectionControllerBase<TData extends DocumentData> {
  protected readonly firestore = inject(Firestore);

  constructor(
    private readonly collectionPathTemplate: Observable<string>,
    protected readonly converter: FirestoreDataConverter<TData>,
  ) {}

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

export type CollectionControllerBaseConstructor<T = {}> = new (
  ...args: any[]
) => T;

export type CollectionControllerMixinsBase<TData extends DocumentData> =
  CollectionControllerBaseConstructor<CollectionControllerBase<TData>>;
