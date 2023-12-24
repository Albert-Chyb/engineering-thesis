import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  FirestoreDataConverter,
  collection,
  collectionSnapshots,
  doc,
  orderBy,
  query,
  runTransaction,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import {
  SaveSolvedTestCloudFnData,
  saveSolvedTestCloudFnDataSchema,
} from '@exam-session/types/save-solved-test-cloud-fn';
import { SolvedTestFormValue } from '@exam-session/types/solved-test-form-value';
import { SolvedTest, SolvedTestSchema } from '@tests-grading/types/solved-test';
import { Observable, from, map } from 'rxjs';

class DataConverter implements FirestoreDataConverter<SolvedTest> {
  toFirestore(modelObject: SolvedTest): SolvedTest {
    throw new Error('Frontend cannot modify solved tests documents');
  }

  fromFirestore(snapshot: any, options: any): SolvedTest {
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
  private readonly firestore = inject(Firestore);

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

  delete(sharedTestId: string, solvedTestId: string) {
    return from(
      runTransaction<void>(this.firestore, async (transaction) => {
        const testDocRef = doc(
          this.firestore,
          `shared-tests/${sharedTestId}/solved-tests/${solvedTestId}`,
        );
        const testAnswersDocRef = doc(
          this.firestore,
          `shared-tests/${sharedTestId}/solved-tests-answers/${solvedTestId}`,
        );

        transaction.delete(testDocRef);
        transaction.delete(testAnswersDocRef);
      }),
    );
  }

  list(sharedTestId: string) {
    const collectionRef = this.getCollectionRef(sharedTestId);
    const collectionQuery = query(collectionRef, orderBy('date', 'desc'));

    return collectionSnapshots(collectionQuery).pipe(
      map((snapshots) => snapshots.map((snapshot) => snapshot.data())),
    );
  }

  private getCollectionRef(sharedTestId: string) {
    return collection(
      this.firestore,
      `shared-tests/${sharedTestId}/solved-tests`,
    ).withConverter(new DataConverter());
  }
}
