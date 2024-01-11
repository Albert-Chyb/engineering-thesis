import { Injectable, inject } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  doc,
  orderBy,
} from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { FirestoreCollectionController } from '@common/classes/FirestoreCollectionController';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import {
  QuestionDoc,
  QuestionSchema,
  RawQuestion,
  RawQuestionSchema,
} from '@test-creator/types/question';
import { Observable, from, map, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService extends FirestoreCollectionController<
  QuestionDoc,
  RawQuestion
> {
  constructor() {
    const auth = inject(AuthService);
    const firestore = inject(Firestore);

    super(
      firestore,
      auth.uid$.pipe(map((uid) => `users/${uid}/tests/{testId}/questions/`)),
      new ZodFirestoreDataConverter(RawQuestionSchema, QuestionSchema),
    );
  }

  override list(params: string[]): Observable<QuestionDoc[]> {
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
