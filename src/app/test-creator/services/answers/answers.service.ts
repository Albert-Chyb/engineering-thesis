import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
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
import { Answer, RawAnswer } from '@test-creator/types/answer';
import { ClosedQuestionsTypes } from '@test-creator/types/questions';
import { Observable, from, map, switchMap, take } from 'rxjs';

class DataConverter
  implements FirestoreDataConverter<Answer<ClosedQuestionsTypes>>
{
  toFirestore(
    modelObject: WithFieldValue<Answer<ClosedQuestionsTypes>>
  ): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<Answer<ClosedQuestionsTypes>>,
    options: SetOptions
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    const model = modelObject as Answer<ClosedQuestionsTypes>;

    return {
      content: model.content,
      position: model.position,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<RawAnswer<ClosedQuestionsTypes>>,
    options?: SnapshotOptions | undefined
  ): Answer<ClosedQuestionsTypes> {
    const data = snapshot.data() as Answer<ClosedQuestionsTypes>;

    return {
      id: snapshot.id,
      content: data.content,
      position: data.position,
    };
  }
}

class AnswersCollectionController extends FirestoreCollectionController<
  Answer<ClosedQuestionsTypes>,
  RawAnswer<ClosedQuestionsTypes>
> {
  constructor(
    firestore: Firestore,
    collectionRef$: Observable<
      CollectionReference<Answer<ClosedQuestionsTypes>>
    >
  ) {
    super(firestore, collectionRef$);
  }

  override list(): Observable<Answer<ClosedQuestionsTypes>[]> {
    return this.query(orderBy('position'));
  }

  swapPositions(
    answer1: Answer<ClosedQuestionsTypes>,
    answer2: Answer<ClosedQuestionsTypes>
  ) {
    return this.collectionRef$.pipe(
      take(1),
      map((collectionRef) => collectionRef.path),
      switchMap((collectionPath) =>
        from(
          this.transaction(async (transaction) => {
            const docRef1 = doc(
              this.firestore,
              `${collectionPath}/${answer1.id}`
            ) as DocumentReference<Answer<ClosedQuestionsTypes>>;

            const docRef2 = doc(
              this.firestore,
              `${collectionPath}/${answer2.id}`
            ) as DocumentReference<Answer<ClosedQuestionsTypes>>;

            const doc1 = await transaction.get(docRef1);
            const doc2 = await transaction.get(docRef2);

            if (!doc1.exists() || !doc2.exists()) {
              throw new Error('One of the answers does not exist');
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
export class AnswersService {
  private readonly auth = inject(AuthService);
  private readonly firestore = inject(Firestore);

  getController(
    testId: string,
    questionId: string
  ): FirestoreCollectionController<
    Answer<ClosedQuestionsTypes>,
    RawAnswer<ClosedQuestionsTypes>
  > {
    const collectionRef$ = this.auth.uid$.pipe(
      map((uid) =>
        collection(
          this.firestore,
          `users/${uid}/tests/${testId}/questions/${questionId}/answers`
        ).withConverter(new DataConverter())
      )
    );
    return new AnswersCollectionController(this.firestore, collectionRef$);
  }
}
