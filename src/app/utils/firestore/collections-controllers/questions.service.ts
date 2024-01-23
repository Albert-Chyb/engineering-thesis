import { Injectable, inject } from '@angular/core';
import { DocumentReference, doc, orderBy } from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { from, map, switchMap, take } from 'rxjs';
import { mixinAllOperations } from '../collection-controller-core/all-operations-mixin';
import { CollectionControllerBase } from '../collection-controller-core/collection-controller-base';
import {
  Question,
  QuestionSchema,
  RawQuestion,
  RawQuestionSchema,
} from '../models/questions.model';

class QuestionsCollectionController extends CollectionControllerBase<Question> {
  constructor() {
    const auth = inject(AuthService);

    super(
      auth.uid$.pipe(map((uid) => `users/${uid}/tests/{testId}/questions/`)),
      new ZodFirestoreDataConverter(RawQuestionSchema, QuestionSchema),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class QuestionsService extends mixinAllOperations<Question, RawQuestion>()(
  QuestionsCollectionController,
) {
  override list(params: string[]) {
    return this.query(params, orderBy('position'));
  }

  swapPositions(testId: string, question1: Question, question2: Question) {
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
