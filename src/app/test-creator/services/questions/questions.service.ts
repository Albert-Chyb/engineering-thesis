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
  orderBy,
} from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { FirestoreCollectionController } from '@common/classes/FirestoreCollectionController';
import { Question, RawQuestion } from '@test-creator/types/question';
import {
  QuestionsContentsTypes,
  QuestionsTypes,
} from '@test-creator/types/questions';
import { Observable, map } from 'rxjs';

class Converter implements FirestoreDataConverter<Question<QuestionsTypes>> {
  toFirestore(
    modelObject: WithFieldValue<Question<QuestionsTypes>>
  ): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<Question<QuestionsTypes>>,
    options: SetOptions
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return modelObject as DocumentData;
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<RawQuestion<QuestionsTypes>>,
    options?: SnapshotOptions | undefined
  ): Question<QuestionsTypes> {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      type: data.type,
      content: data.content,
      position: data.position,
    };
  }
}

class QuestionsServiceController extends FirestoreCollectionController<
  Question<QuestionsTypes>,
  RawQuestion<QuestionsTypes>
> {
  override list(): Observable<Question<keyof QuestionsContentsTypes>[]> {
    return this.query(orderBy('position'));
  }
}

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private readonly auth = inject(AuthService);
  private readonly firestore = inject(Firestore);

  getController(
    testId: string
  ): FirestoreCollectionController<
    Question<QuestionsTypes>,
    RawQuestion<QuestionsTypes>
  > {
    const collectionRef$ = this.auth.uid$.pipe(
      map((uid) => `users/${uid}/tests/${testId}/questions/`),
      map((path) =>
        collection(this.firestore, path).withConverter(new Converter())
      )
    );

    return new QuestionsServiceController(this.firestore, collectionRef$);
  }
}
