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
  docData,
} from '@angular/fire/firestore';
import {
  SolvedTestAnswers,
  SolvedTestAnswersSchema,
} from '@tests-grading/types/solved-test-answers';

class DataConverter implements FirestoreDataConverter<SolvedTestAnswers> {
  toFirestore(modelObject: WithFieldValue<SolvedTestAnswers>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<SolvedTestAnswers>,
    options: SetOptions,
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    throw new Error('Frontend cannot modify solved tests answers data.');
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined,
  ): SolvedTestAnswers {
    return SolvedTestAnswersSchema.parse({
      ...snapshot.data(options),
      id: snapshot.id,
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class SolvedTestsAnswersService {
  private readonly firestore = inject(Firestore);

  get(sharedTestId: string, solvedTestId: string) {
    const collectionRef = this.getCollectionRef(sharedTestId);
    const answersRef = doc(collectionRef, solvedTestId);

    return docData(answersRef);
  }

  private getCollectionRef(sharedTestId: string) {
    return collection(
      this.firestore,
      `shared-tests/${sharedTestId}/solved-tests-answers`,
    ).withConverter(new DataConverter());
  }
}
