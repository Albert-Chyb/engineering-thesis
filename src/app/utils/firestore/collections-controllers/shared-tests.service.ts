import { Injectable } from '@angular/core';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { of } from 'rxjs';
import { z } from 'zod';
import { CollectionControllerBase } from '../collection-controller-core/collection-controller-base';
import { mixinDelete } from '../collection-controller-core/delete-mixin';
import { mixinRead } from '../collection-controller-core/read-mixin';
import { SharedTest, SharedTestSchema } from '../models/shared-tests.model';

class SharedTestsCollectionController extends CollectionControllerBase<SharedTest> {
  constructor() {
    super(
      of('shared-tests'),
      new ZodFirestoreDataConverter(z.never(), SharedTestSchema),
    );
  }
}

const MixedController = mixinRead<SharedTest>()(
  mixinDelete()(SharedTestsCollectionController),
);

@Injectable({
  providedIn: 'root',
})
export class SharedTestsService extends MixedController {}
