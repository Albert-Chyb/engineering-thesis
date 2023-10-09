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
  ClosedQuestion,
  OpenQuestion,
  QuestionCreatePayload,
  QuestionReadPayload,
} from '@test-creator/types/question';
import { map } from 'rxjs';

class Converter
  implements FirestoreDataConverter<OpenQuestion | ClosedQuestion<any>>
{
  toFirestore(
    modelObject: WithFieldValue<OpenQuestion | ClosedQuestion<any>>
  ): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<OpenQuestion | ClosedQuestion<any>>,
    options: SetOptions
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return modelObject as DocumentData;
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<QuestionReadPayload<any>>,
    options?: SnapshotOptions | undefined
  ): OpenQuestion | ClosedQuestion<any> {
    const data = snapshot.data();

    if (data.type === 'single-choice') {
      const closedQuestion = data as ClosedQuestion<'single-choice'>;

      return {
        id: snapshot.id,
        type: closedQuestion.type,
        content: closedQuestion.content,
        answers: closedQuestion.answers,
      };
    } else if (data.type === 'multi-choice') {
      const closedQuestion = data as ClosedQuestion<'multi-choice'>;

      return {
        id: snapshot.id,
        type: closedQuestion.type,
        content: closedQuestion.content,
        answers: closedQuestion.answers,
      };
    } else {
      const openQuestion = data as OpenQuestion;

      return {
        id: snapshot.id,
        type: openQuestion.type,
        content: openQuestion.content,
      };
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class QuestionsServiceService {
  private readonly auth = inject(AuthService);
  private readonly firestore = inject(Firestore);

  getController(
    testId: string
  ): FirestoreCollectionController<
    OpenQuestion | ClosedQuestion<any>,
    QuestionCreatePayload<any>
  > {
    const collectionRef$ = this.auth.uid$.pipe(
      map((uid) => `users/${uid}/tests/${testId}/questions/`),
      map((path) =>
        collection(this.firestore, path).withConverter(new Converter())
      )
    );

    return new FirestoreCollectionController(collectionRef$);
  }
}
