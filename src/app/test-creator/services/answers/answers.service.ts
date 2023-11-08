import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  SetOptions,
  SnapshotOptions,
  WithFieldValue,
  collection,
  orderBy,
} from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { FirestoreCollectionController } from '@common/classes/FirestoreCollectionController';
import { Answer, RawAnswer } from '@test-creator/types/answer';
import { ClosedQuestionsTypes } from '@test-creator/types/questions';
import { Observable, map } from 'rxjs';

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
