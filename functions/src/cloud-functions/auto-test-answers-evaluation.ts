import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { answersKeysDoc } from '../data-access/answers-keys';
import { sharedTest } from '../data-access/shared-tests';
import { sharedTestMetadata } from '../data-access/shared-tests-metadata';
import { compareSolvedTestAnswers } from '../helpers/compare-solved-test-answers';
import { SolvedTestAnswer } from '../models/solved-test-answers';
import {
  AnswersEvaluations,
  FnData as EvaluateAnswersCloudFnData,
  evaluateSolvedTestAnswersFn,
} from './evaluate-solved-test-answers';

export const autoTestAnswersEvaluation = onDocumentCreated(
  'shared-tests/{sharedTestId}/solved-tests-answers/{solvedTestId}',
  async (event) => {
    const sharedTestId = event.params.sharedTestId;
    const sharedTestRef = sharedTest(sharedTestId);
    const sharedTestSnap = await sharedTestRef.get();

    const answersKeysRef = answersKeysDoc(sharedTestId);
    const answersKeysSnap = await answersKeysRef.get();

    if (!answersKeysSnap.exists || !sharedTestSnap.exists) {
      return;
    }

    const answersKeys = answersKeysSnap.data()!;
    const evaluations: AnswersEvaluations = {};

    for (const questionId in answersKeys) {
      // Get a valid answer from answers keys
      const validAnswer = answersKeys[questionId];

      // If the there is a valid answer for the question
      if (validAnswer) {
        const userAnswer = event.data?.get(`answers.${questionId}`)
          .answer as SolvedTestAnswer['answer'];
        const questionType = sharedTestSnap
          .data()!
          .questions.find((q) => q.id === questionId)!.type;

        if (!questionType) {
          throw new Error(
            `Question with id of ${questionId} does not exist in the shared test with id of ${sharedTestId}`,
          );
        }

        // Compare the user answer with the valid answer
        const isCorrect = compareSolvedTestAnswers(questionType, [
          validAnswer,
          userAnswer,
        ]);

        // Add the evaluation to the evaluations object
        evaluations[questionId] = isCorrect;
      }
    }

    const cloudFnData: EvaluateAnswersCloudFnData = {
      answersEvaluations: evaluations,
      sharedTestId,
      solvedTestId: event.params.solvedTestId,
    };

    const sharedTestMetadataSnap = await sharedTestMetadata(sharedTestId).get();

    if (!sharedTestMetadataSnap.exists) {
      throw new Error(
        `Shared test metadata with id of ${sharedTestId} does not exist`,
      );
    }

    await evaluateSolvedTestAnswersFn(
      cloudFnData,
      sharedTestMetadataSnap.data()!.author,
    );
  },
);
