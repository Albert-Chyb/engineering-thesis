import { Injectable, inject } from '@angular/core';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { SolvedTestAnswersEvaluations } from '@tests-grading/types/solved-test-answers-evaluations';
import { CloudFunctionsService } from '@utils/cloud-functions/core/cloud-functions.service';
import { of } from 'rxjs';
import { z } from 'zod';
import { CollectionControllerBase } from '../collection-controller-core/collection-controller-base';
import { mixinDelete } from '../collection-controller-core/delete-mixin';
import { mixinReadOnly } from '../collection-controller-core/read-only-mixin';
import {
  SolvedTestAnswers,
  SolvedTestAnswersSchema,
} from '../models/solved-test-answers.model';

class SolvedTestsAnswersCollectionController extends CollectionControllerBase<SolvedTestAnswers> {
  constructor() {
    super(
      of(`shared-tests/{sharedTestId}/solved-tests-answers`),
      new ZodFirestoreDataConverter(z.never(), SolvedTestAnswersSchema),
    );
  }
}

const MixedController = mixinReadOnly<SolvedTestAnswers>()(
  mixinDelete<SolvedTestAnswers>()(SolvedTestsAnswersCollectionController),
);

@Injectable({
  providedIn: 'root',
})
export class SolvedTestsAnswersService extends MixedController {
  private readonly cloudFunctions = inject(CloudFunctionsService);

  evaluateAnswers(
    sharedTestId: string,
    solvedTestId: string,
    evaluations: SolvedTestAnswersEvaluations,
  ) {
    const data = {
      sharedTestId,
      solvedTestId,
      answersEvaluations: evaluations,
    };

    return this.cloudFunctions.call('evaluateSolvedTestAnswers', data);
  }
}
