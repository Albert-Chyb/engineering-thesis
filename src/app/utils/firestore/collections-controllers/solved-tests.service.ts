import { Injectable, inject } from '@angular/core';
import {
  collectionData,
  collectionGroup,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { AuthService } from '@authentication/services/auth.service';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { SolvedTestFormValue } from '@exam-session/types/solved-test-form-value';
import { CloudFunctionsService } from '@utils/cloud-functions/core/cloud-functions.service';
import { Observable, of, switchMap } from 'rxjs';
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
  private readonly auth = inject(AuthService);
  private readonly cloudFunctions = inject(CloudFunctionsService);

  saveSolvedTest(
    sharedTestId: string,
    solvedTest: SolvedTestFormValue,
  ): Observable<string> {
    const data = {
      sharedTestId,
      ...solvedTest,
    };

    return this.cloudFunctions.call('saveSolvedTest', data);
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
