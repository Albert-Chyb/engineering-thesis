import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import {
  AnswersKeys,
  AnswersKeysSchema,
} from '@answers-keys/types/answers-keys';
import {
  SaveAnswersKeyCloudFnData,
  SaveAnswersKeyCloudFnDataSchema,
} from '@answers-keys/types/save-answers-key-cloud-fn-data';
import { QuestionsAnswers } from '@exam-session/types/user-answers';
import { from } from 'rxjs';

class DataConverter implements FirestoreDataConverter<AnswersKeys> {
  toFirestore(modelObject: AnswersKeys): AnswersKeys {
    throw new Error('Frontend should not write modify answers keys');
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<AnswersKeys>,
    options?: SnapshotOptions | undefined,
  ): AnswersKeys {
    return AnswersKeysSchema.parse(snapshot.data(options));
  }
}

@Injectable({
  providedIn: 'root',
})
export class AnswersKeysService {
  private readonly functions = inject(Functions);
  private readonly firestore = inject(Firestore);

  create(sharedTestId: string, answers: QuestionsAnswers) {
    const data = SaveAnswersKeyCloudFnDataSchema.parse({
      sharedTestId,
      answersKeys: answers,
    });

    return from(
      httpsCallable<SaveAnswersKeyCloudFnData, void>(
        this.functions,
        'saveAnswersKeys',
      )(data),
    );
  }

  read(sharedTestId: string) {
    return docData(doc(this.getCollectionRef(), sharedTestId));
  }

  private getCollectionRef() {
    return collection(this.firestore, 'answers-keys').withConverter(
      new DataConverter(),
    );
  }
}
