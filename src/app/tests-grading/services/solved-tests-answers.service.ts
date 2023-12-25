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
  doc,
  docData,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { EvaluateSolvedTestAnswersFnData } from '@tests-grading/types/evaluate-solved-test-answers-fn-data';
import {
  SolvedTestAnswers,
  SolvedTestAnswersSchema,
} from '@tests-grading/types/solved-test-answers';
import { SolvedTestAnswersEvaluations } from '@tests-grading/types/solved-test-answers-evaluations';
import { from, map } from 'rxjs';

class DataConverter implements FirestoreDataConverter<SolvedTestAnswers> {
  toFirestore(modelObject: WithFieldValue<SolvedTestAnswers>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<SolvedTestAnswers>,
    options: SetOptions,
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    throw new Error('Frontend cannot modify solved tests answers data.');
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined,
  ): SolvedTestAnswers {
    return SolvedTestAnswersSchema.parse({
      ...snapshot.data(options),
      id: snapshot.id,
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class SolvedTestsAnswersService {
  private readonly firestore = inject(Firestore);
  private readonly functions = inject(Functions);

  get(sharedTestId: string, solvedTestId: string) {
    const collectionRef = this.getCollectionRef(sharedTestId);
    const answersRef = doc(collectionRef, solvedTestId);

    return docData(answersRef);
  }

  evaluateAnswers(
    sharedTestId: string,
    solvedTestId: string,
    evaluations: SolvedTestAnswersEvaluations,
  ) {
    return from(
      httpsCallable<EvaluateSolvedTestAnswersFnData, void>(
        this.functions,
        'evaluateSolvedTestAnswers',
      )({
        sharedTestId,
        solvedTestId,
        answersEvaluations: evaluations,
      }),
    ).pipe(map(() => undefined));
  }

  private getCollectionRef(sharedTestId: string) {
    return collection(
      this.firestore,
      `shared-tests/${sharedTestId}/solved-tests-answers`,
    ).withConverter(new DataConverter());
  }
}
