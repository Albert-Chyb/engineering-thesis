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
} from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { FirestoreCollectionController } from '@common/classes/FirestoreCollectionController';
import {
  Question,
  QuestionCreatePayload,
  QuestionReadPayload,
  QuestionsTypes,
} from '@test-creator/types/question';
import { map } from 'rxjs';

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
    snapshot: QueryDocumentSnapshot<QuestionReadPayload<any>>,
    options?: SnapshotOptions | undefined
  ): Question<QuestionsTypes> {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      type: data.type,
      content: data.content,
    };
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
    QuestionCreatePayload<QuestionsTypes>
  > {
    const collectionRef$ = this.auth.uid$.pipe(
      map((uid) => `users/${uid}/tests/${testId}/questions/`),
      map((path) =>
        collection(this.firestore, path).withConverter(new Converter())
      )
    );

    return new FirestoreCollectionController(this.firestore, collectionRef$);
  }
}
