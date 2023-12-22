import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import {
  SaveSolvedTestCloudFnData,
  saveSolvedTestCloudFnDataSchema,
} from '@exam-session/types/save-solved-test-cloud-fn';
import { SolvedTestFormValue } from '@exam-session/types/solved-test';
import { Observable, from, map } from 'rxjs';

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
