import { Injectable, inject } from '@angular/core';
import {
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
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore';
import {
  RawSolvedTestSchema,
  SolvedTest,
  SolvedTestFormValue,
  SolvedTestSchema,
} from '@exam-session/types/solved-test';
import { from } from 'rxjs';

class DataConverter implements FirestoreDataConverter<SolvedTest> {
  toFirestore(modelObject: WithFieldValue<SolvedTest>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<SolvedTest>,
    options: SetOptions,
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return RawSolvedTestSchema.parse(modelObject);
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined,
  ): SolvedTest {
    return SolvedTestSchema.parse({
      ...snapshot.data(options),
      id: snapshot.id,
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class SolvedTestsService {
  private readonly firestore = inject(Firestore);

  saveSolvedTest(sharedTestId: string, solvedTest: SolvedTestFormValue) {
    const collectionRef = this.getSolvedTestsCollection(sharedTestId);
    const docRef = doc(collectionRef);
    const docData = RawSolvedTestSchema.parse({
      ...solvedTest,
      date: serverTimestamp(),
      sharedTestId,
    });

    return from(setDoc(docRef, docData));
  }

  private getSolvedTestsCollection(sharedTestId: string) {
    return collection(
      this.firestore,
      `shared-tests/${sharedTestId}/solved-tests`,
    ).withConverter(new DataConverter());
  }
}
