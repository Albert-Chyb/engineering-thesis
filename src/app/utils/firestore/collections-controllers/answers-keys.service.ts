import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import {
  SaveAnswersKeyCloudFnData,
  SaveAnswersKeyCloudFnDataSchema,
} from '@answers-keys/types/save-answers-key-cloud-fn-data';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { from, of } from 'rxjs';
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
  private readonly functions = inject(Functions);

  create(sharedTestId: string, answers: UserAnswers) {
    const data = SaveAnswersKeyCloudFnDataSchema.parse({
      sharedTestId,
      answersKeys: answers,
    });

    return from(
      httpsCallable<SaveAnswersKeyCloudFnData, void>(
        this.functions,
        'saveAnswersKeys',
      )(data),
    );
  }
}
