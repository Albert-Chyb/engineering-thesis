import { Injectable, inject } from '@angular/core';
import { DocumentReference, doc, orderBy } from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { Observable, from, map, switchMap, take } from 'rxjs';
import { mixinAllOperations } from '../collection-controller-core/all-operations-mixin';
import { CollectionControllerBase } from '../collection-controller-core/collection-controller-base';
import {
  Answer,
  AnswerSchema,
  RawAnswer,
  RawAnswerSchema,
} from '../models/answers.model';

class AnswersCollectionController extends CollectionControllerBase<Answer> {
  constructor() {
    const auth = inject(AuthService);

    super(
      auth.uid$.pipe(
        map(
          (uid) =>
            `users/${uid}/tests/{testId}/questions/{questionId}/answers/`,
        ),
      ),
      new ZodFirestoreDataConverter(RawAnswerSchema, AnswerSchema),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class AnswersService extends mixinAllOperations<Answer, RawAnswer>()(
  AnswersCollectionController,
) {
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
