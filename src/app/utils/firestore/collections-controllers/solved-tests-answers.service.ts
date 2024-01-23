import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { ZodFirestoreDataConverter } from '@common/classes/ZodFirestoreDataConverter';
import { EvaluateSolvedTestAnswersFnData } from '@tests-grading/types/evaluate-solved-test-answers-fn-data';
import { SolvedTestAnswersEvaluations } from '@tests-grading/types/solved-test-answers-evaluations';
import { from, map, of } from 'rxjs';
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
  private readonly functions = inject(Functions);

  evaluateAnswers(
    sharedTestId: string,
    solvedTestId: string,
    evaluations: SolvedTestAnswersEvaluations,
  ) {
    return from(
      httpsCallable<EvaluateSolvedTestAnswersFnData, void>(
        this.functions,
        'evaluateSolvedTestAnswers',
      )({
        sharedTestId,
        solvedTestId,
        answersEvaluations: evaluations,
      }),
    ).pipe(map(() => undefined));
  }
}
