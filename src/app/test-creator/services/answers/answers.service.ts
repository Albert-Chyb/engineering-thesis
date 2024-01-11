import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  SetOptions,
  SnapshotOptions,
  WithFieldValue,
  doc,
  orderBy,
} from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { FirestoreCollectionController } from '@common/classes/FirestoreCollectionController';
import {
  Answer,
  AnswerSchema,
  RawAnswer,
  RawAnswerSchema,
} from '@test-creator/types/answer';
import { Observable, from, map, switchMap, take } from 'rxjs';

class DataConverter implements FirestoreDataConverter<Answer> {
  toFirestore(modelObject: WithFieldValue<Answer>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<Answer>,
    options: SetOptions,
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return RawAnswerSchema.parse(modelObject);
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<RawAnswer>,
    options?: SnapshotOptions | undefined,
  ): Answer {
    return AnswerSchema.parse({
      id: snapshot.id,
      ...snapshot.data(options),
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class AnswersService extends FirestoreCollectionController<
  Answer,
  RawAnswer
> {
  constructor() {
    const auth = inject(AuthService);
    const firestore = inject(Firestore);

    super(
      firestore,
      auth.uid$.pipe(
        map(
          (uid) =>
            `users/${uid}/tests/{testId}/questions/{questionId}/answers/`,
        ),
      ),
      new DataConverter(),
    );
  }

  override list(params: string[]): Observable<Answer[]> {
    return this.query(params, orderBy('position'));
  }

  swapPositions(
    testId: string,
    questionId: string,
    answer1: Answer,
    answer2: Answer,
  ) {
    return this.getCollectionRef([testId, questionId]).pipe(
      take(1),
      map((collectionRef) => collectionRef.path),
      switchMap((collectionPath) =>
        from(
          this.transaction(async (transaction) => {
            const docRef1 = doc(
              this.firestore,
              `${collectionPath}/${answer1.id}`,
            ) as DocumentReference<Answer>;

            const docRef2 = doc(
              this.firestore,
              `${collectionPath}/${answer2.id}`,
            ) as DocumentReference<Answer>;

            const doc1 = await transaction.get(docRef1);
            const doc2 = await transaction.get(docRef2);

            if (!doc1.exists() || !doc2.exists()) {
              throw new Error('One of the answers does not exist');
            }

            transaction
              .update(docRef1, { position: doc2.data().position })
              .update(docRef2, { position: doc1.data().position });
          }),
        ),
      ),
    );
  }
}
