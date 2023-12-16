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
import { Observable, from, map, switchMap, take } from 'rxjs';

class DataConverter implements FirestoreDataConverter<Answer> {
  toFirestore(modelObject: WithFieldValue<Answer>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<Answer>,
    options: SetOptions
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    const model = modelObject as Answer;

    return {
      content: model.content,
      position: model.position,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<RawAnswer>,
    options?: SnapshotOptions | undefined
  ): Answer {
    const data = snapshot.data() as Answer;

    return {
      id: snapshot.id,
      content: data.content,
      position: data.position,
    };
  }
}

class AnswersCollectionController extends FirestoreCollectionController<
  Answer,
  RawAnswer
> {
  constructor(
    firestore: Firestore,
    collectionRef$: Observable<CollectionReference<Answer>>
  ) {
    super(firestore, collectionRef$);
  }

  override list(): Observable<Answer[]> {
    return this.query(orderBy('position'));
  }

  swapPositions(answer1: Answer, answer2: Answer) {
    return this.collectionRef$.pipe(
      take(1),
      map((collectionRef) => collectionRef.path),
      switchMap((collectionPath) =>
        from(
          this.transaction(async (transaction) => {
            const docRef1 = doc(
              this.firestore,
              `${collectionPath}/${answer1.id}`
            ) as DocumentReference<Answer>;

            const docRef2 = doc(
              this.firestore,
              `${collectionPath}/${answer2.id}`
            ) as DocumentReference<Answer>;

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
  ): AnswersCollectionController {
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
