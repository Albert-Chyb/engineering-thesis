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
import { Question } from '@test-creator/classes/question';
import {
  QuestionDoc,
  QuestionSchema,
  RawQuestion,
  RawQuestionSchema,
} from '@test-creator/types/question';
import { Observable, from, map, switchMap, take } from 'rxjs';

class Converter implements FirestoreDataConverter<Question> {
  toFirestore(modelObject: WithFieldValue<Question>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<Question>,
    options: SetOptions,
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return RawQuestionSchema.parse(modelObject);
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<RawQuestion>,
    options?: SnapshotOptions | undefined,
  ): Question {
    const doc = QuestionSchema.parse({
      ...snapshot.data(options),
      id: snapshot.id,
    });

    return new Question(doc);
  }
}

@Injectable({
  providedIn: 'root',
})
export class QuestionsService extends FirestoreCollectionController<
  Question,
  RawQuestion
> {
  constructor() {
    const auth = inject(AuthService);
    const firestore = inject(Firestore);

    super(
      firestore,
      auth.uid$.pipe(map((uid) => `users/${uid}/tests/{testId}/questions/`)),
      new Converter(),
    );
  }

  override list(params: string[]): Observable<Question[]> {
    return this.query(params, orderBy('position'));
  }

  swapPositions(
    testId: string,
    question1: QuestionDoc,
    question2: QuestionDoc,
  ) {
    return this.getCollectionRef([testId]).pipe(
      take(1),
      map((collectionRef) => collectionRef.path),
      switchMap((collectionPath) =>
        from(
          this.transaction(async (transaction) => {
            const docRef1 = doc(
              this.firestore,
              `${collectionPath}/${question1.id}`,
            ) as DocumentReference<RawQuestion>;

            const docRef2 = doc(
              this.firestore,
              `${collectionPath}/${question2.id}`,
            ) as DocumentReference<RawQuestion>;

            const doc1 = await transaction.get(docRef1);
            const doc2 = await transaction.get(docRef2);

            if (!doc1.exists() || !doc2.exists()) {
              throw new Error('One of the questions does not exist');
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
