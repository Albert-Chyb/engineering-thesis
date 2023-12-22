import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  FirestoreDataConverter,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  SetOptions,
  SnapshotOptions,
  WithFieldValue,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import {
  SaveSolvedTestCloudFnData,
  saveSolvedTestCloudFnDataSchema,
} from '@exam-session/types/save-solved-test-cloud-fn';
import {
  RawSolvedTestSchema,
  SolvedTest,
  SolvedTestFormValue,
  SolvedTestSchema,
} from '@exam-session/types/solved-test';
import { Observable, from, map } from 'rxjs';

class DataConverter implements FirestoreDataConverter<SolvedTest> {
  toFirestore(modelObject: WithFieldValue<SolvedTest>): DocumentData;
  toFirestore(
    modelObject: PartialWithFieldValue<SolvedTest>,
    options: SetOptions,
  ): DocumentData;
  toFirestore(modelObject: unknown, options?: unknown): DocumentData {
    return RawSolvedTestSchema.parse(modelObject);
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined,
  ): SolvedTest {
    return SolvedTestSchema.parse({
      ...snapshot.data(options),
      id: snapshot.id,
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class SolvedTestsService {
  private readonly functions = inject(Functions);

  saveSolvedTest(
    sharedTestId: string,
    solvedTest: SolvedTestFormValue,
  ): Observable<string> {
    return from(
      httpsCallable<SaveSolvedTestCloudFnData, string>(
        this.functions,
        'saveSolvedTest',
      )(
        saveSolvedTestCloudFnDataSchema.parse({
          sharedTestId,
          ...solvedTest,
        }),
      ),
    ).pipe(map((result) => result.data));
  }
}
