import { Injectable, inject } from '@angular/core';
import {
  collectionData,
  collectionGroup,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { AuthService } from '@authentication/services/auth.service';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import {
  SaveSolvedTestCloudFnData,
  saveSolvedTestCloudFnDataSchema,
} from '@exam-session/types/save-solved-test-cloud-fn';
import { SolvedTestFormValue } from '@exam-session/types/solved-test-form-value';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { z } from 'zod';
import { CollectionControllerBase } from '../collection-controller-core/collection-controller-base';
import { mixinDelete } from '../collection-controller-core/delete-mixin';
import { mixinReadOnly } from '../collection-controller-core/read-only-mixin';
import { SolvedTest, SolvedTestSchema } from '../models/solved-tests.model';

class SolvedTestsCollectionController extends CollectionControllerBase<SolvedTest> {
  constructor() {
    super(
      of('shared-tests/{sharedTestId}/solved-tests'),
      new ZodFirestoreDataConverter(z.never(), SolvedTestSchema),
    );
  }
}

const MixedController = mixinReadOnly<SolvedTest>()(
  mixinDelete<SolvedTest>()(SolvedTestsCollectionController),
);

@Injectable({
  providedIn: 'root',
})
export class SolvedTestsService extends MixedController {
  private readonly functions = inject(Functions);
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

  override list(params?: string[]) {
    return this.query(params, orderBy('date', 'desc'));
  }

  listForCurrentUser() {
    return this.auth.uid$.pipe(
      switchMap((uid) => {
        const collectionGroupRef = collectionGroup(
          this.firestore,
          'solved-tests',
        ).withConverter(this.converter);

        const q = query(
          collectionGroupRef,
          where('testTakerId', '==', uid),
          orderBy('date', 'desc'),
        );

        return collectionData(q);
      }),
    );
  }
}
