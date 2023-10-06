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
import { Answer, RawAnswer } from '@test-creator/types/answer';
import { map } from 'rxjs';

class DataConverter implements FirestoreDataConverter<Answer<any>> {
  toFirestore(modelObject: WithFieldValue<Answer<any>>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<Answer<any>>,
    options: SetOptions
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    const model = modelObject as Answer<any>;

    return {
      content: model.content,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<RawAnswer<any>>,
    options?: SnapshotOptions | undefined
  ): Answer<any> {
    const data = snapshot.data() as Answer<any>;

    return {
      id: snapshot.id,
      content: data.content,
    };
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
  ): FirestoreCollectionController<Answer<any>, RawAnswer<any>> {
    const collectionRef$ = this.auth.uid$.pipe(
      map((uid) =>
        collection(
          this.firestore,
          `users/${uid}/tests/${testId}/questions/${questionId}/answers`
        ).withConverter(new DataConverter())
      )
    );
    return new FirestoreCollectionController(collectionRef$);
  }
}
