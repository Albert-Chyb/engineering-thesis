import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  FirestoreDataConverter,
  collection,
  collectionData,
  collectionGroup,
  doc,
  docData,
  orderBy,
  query,
  runTransaction,
  where,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { AuthService } from '@authentication/services/auth.service';
import {
  SaveSolvedTestCloudFnData,
  saveSolvedTestCloudFnDataSchema,
} from '@exam-session/types/save-solved-test-cloud-fn';
import { SolvedTestFormValue } from '@exam-session/types/solved-test-form-value';
import { SolvedTest, SolvedTestSchema } from '@tests-grading/types/solved-test';
import { Observable, from, map, switchMap } from 'rxjs';

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
  private readonly auth = inject(AuthService);

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

    return collectionData(collectionQuery);
  }

  listForCurrentUser() {
    return this.auth.uid$.pipe(
      switchMap((uid) => {
        const collectionGroupRef = collectionGroup(
          this.firestore,
          'solved-tests',
        ).withConverter(new DataConverter());
        const q = query(
          collectionGroupRef,
          where('testTakerId', '==', uid),
          orderBy('date', 'desc'),
        );

        return collectionData(q);
      }),
    );
  }

  get(sharedTestId: string, solvedTestId: string) {
    const collectionRef = this.getCollectionRef(sharedTestId);
    const docRef = doc(collectionRef, solvedTestId);

    return docData(docRef);
  }

  private getCollectionRef(sharedTestId: string) {
    return collection(
      this.firestore,
      `shared-tests/${sharedTestId}/solved-tests`,
    ).withConverter(new DataConverter());
  }
}
