import { Injectable, inject } from '@angular/core';
import { Functions } from '@angular/fire/functions';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { CloudFunctionsService } from '@utils/cloud-functions/core/cloud-functions.service';
import { of } from 'rxjs';
import { z } from 'zod';
import { CollectionControllerBase } from '../collection-controller-core/collection-controller-base';
import { mixinDelete } from '../collection-controller-core/delete-mixin';
import { mixinReadOnly } from '../collection-controller-core/read-only-mixin';
import { UserAnswers, UserAnswersSchema } from '../models/user-answers.model';

class AnswersKeysCollectionController extends CollectionControllerBase<UserAnswers> {
  constructor() {
    super(
      of('answers-keys'),
      new ZodFirestoreDataConverter(z.never(), UserAnswersSchema),
    );
  }
}

const MixedController = mixinReadOnly<UserAnswers>()(
  mixinDelete<UserAnswers>()(AnswersKeysCollectionController),
);

@Injectable({
  providedIn: 'root',
})
export class AnswersKeysService extends MixedController {
  private readonly cloudFunctions = inject(CloudFunctionsService);
  private readonly functions = inject(Functions);

  create(sharedTestId: string, answers: UserAnswers) {
    const data = {
      sharedTestId,
      answersKeys: answers,
    };

    return this.cloudFunctions.call('saveAnswersKeys', data);
  }
}
