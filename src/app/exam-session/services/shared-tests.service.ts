import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  SetOptions,
  SnapshotOptions,
  WithFieldValue,
  collection,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import {
  AssembledTest,
  AssembledTestSchema,
} from '@test-creator/types/assembled-test';
import { Observable, from, map } from 'rxjs';

class DataConverter implements FirestoreDataConverter<AssembledTest> {
  toFirestore(modelObject: WithFieldValue<AssembledTest>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<AssembledTest>,
    options: SetOptions,
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    throw new Error('Direct modification of shared tests is not allowed.');
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined,
  ): AssembledTest {
    return AssembledTestSchema.parse({
      ...snapshot.data(options),
      id: snapshot.id,
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class SharedTestsService {
  private readonly firestore = inject(Firestore);

  getSharedTest(id: string): Observable<AssembledTest> {
    return from(getDoc(doc(this.getSharedTestCollectionRef(), id))).pipe(
      map((snap) => {
        const testData = snap.data();

        if (!testData) {
          throw new Error('Shared test not found.');
        }

        return testData;
      }),
    );
  }

  private getSharedTestCollectionRef(): CollectionReference<AssembledTest> {
    return collection(this.firestore, 'shared-tests').withConverter(
      new DataConverter(),
    );
  }
}
