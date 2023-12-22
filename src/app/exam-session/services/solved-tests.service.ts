import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  FirestoreDataConverter,
  collection,
  getDocs,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import {
  SaveSolvedTestCloudFnData,
  saveSolvedTestCloudFnDataSchema,
} from '@exam-session/types/save-solved-test-cloud-fn';
import { SolvedTestFormValue } from '@exam-session/types/solved-test';
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

  list(sharedTestId: string) {
    const collectionRef = this.getCollectionRef(sharedTestId);

    return from(getDocs(collectionRef)).pipe(
      map((querySnap) => querySnap.docs.map((doc) => doc.data())),
    );
  }

  private getCollectionRef(sharedTestId: string) {
    return collection(
      this.firestore,
      `shared-tests/${sharedTestId}/solved-tests`,
    ).withConverter(new DataConverter());
  }
}
