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
  collection,
  doc,
  orderBy,
} from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { FirestoreCollectionController } from '@common/classes/FirestoreCollectionController';
import { Question } from '@test-creator/classes/question';
import { QuestionDoc, RawQuestion } from '@test-creator/types/question';
import { QuestionsTypes } from '@test-creator/types/questions';
import { Observable, from, map, switchMap, take } from 'rxjs';

class Converter implements FirestoreDataConverter<Question<QuestionsTypes>> {
  toFirestore(
    modelObject: WithFieldValue<Question<QuestionsTypes>>
  ): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<Question<QuestionsTypes>>,
    options: SetOptions
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    if (modelObject instanceof Object) {
      const obj: Record<string, any> = modelObject;

      return {
        type: obj['type'],
        content: obj['content'],
        position: obj['position'],
      };
    } else {
      return {};
    }
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<RawQuestion<QuestionsTypes>>,
    options?: SnapshotOptions | undefined
  ): Question<QuestionsTypes> {
    const data = snapshot.data();

    return new Question({
      id: snapshot.id,
      type: data.type,
      content: data.content,
      position: data.position,
    });
  }
}

class QuestionsServiceController extends FirestoreCollectionController<
  Question<QuestionsTypes>,
  RawQuestion<QuestionsTypes>
> {
  override list(): Observable<Question<QuestionsTypes>[]> {
    return this.query(orderBy('position'));
  }

  swapPositions(
    question1: QuestionDoc<QuestionsTypes>,
    question2: QuestionDoc<QuestionsTypes>
  ) {
    return this.collectionRef$.pipe(
      take(1),
      map((collectionRef) => collectionRef.path),
      switchMap((collectionPath) =>
        from(
          this.transaction(async (transaction) => {
            const docRef1 = doc(
              this.firestore,
              `${collectionPath}/${question1.id}`
            ) as DocumentReference<RawQuestion<QuestionsTypes>>;

            const docRef2 = doc(
              this.firestore,
              `${collectionPath}/${question2.id}`
            ) as DocumentReference<RawQuestion<QuestionsTypes>>;

            const doc1 = await transaction.get(docRef1);
            const doc2 = await transaction.get(docRef2);

            if (!doc1.exists() || !doc2.exists()) {
              throw new Error('One of the questions does not exist');
            }

            transaction
              .update(docRef1, { position: doc2.data().position })
              .update(docRef2, { position: doc1.data().position });
          })
        )
      )
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private readonly auth = inject(AuthService);
  private readonly firestore = inject(Firestore);

  getController(testId: string) {
    const collectionRef$ = this.auth.uid$.pipe(
      map((uid) => `users/${uid}/tests/${testId}/questions/`),
      map((path) =>
        collection(this.firestore, path).withConverter(new Converter())
      )
    );

    return new QuestionsServiceController(this.firestore, collectionRef$);
  }
}
