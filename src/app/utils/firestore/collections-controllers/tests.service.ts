import { Injectable, inject } from '@angular/core';
import { AuthService } from '@authentication/services/auth.service';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { map } from 'rxjs';
import { mixinAllOperations } from '../collection-controller-core/all-operations-mixin';
import { CollectionControllerBase } from '../collection-controller-core/collection-controller-base';
import {
  RawTest,
  RawTestSchema,
  Test,
  TestSchema,
} from '../models/tests.model';

class TestsCollectionController extends CollectionControllerBase<Test> {
  constructor() {
    const auth = inject(AuthService);

    super(
      auth.uid$.pipe(map((uid) => `users/${uid}/tests`)),
      new ZodFirestoreDataConverter(RawTestSchema, TestSchema),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class TestsService extends mixinAllOperations<Test, RawTest>()(
  TestsCollectionController,
) {}
