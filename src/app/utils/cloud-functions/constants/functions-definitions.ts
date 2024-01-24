import { EVALUATE_SOLVED_TEST_ANSWERS_CLOUD_FN_DEFINITION } from '../definitions/evaluate-solved-test-answers';
import { SAVE_ANSWERS_KEYS_CLOUD_FN_DEFINITION } from '../definitions/save-answers-keys';
import { SAVE_SOLVED_TEST_CLOUD_FN_DEFINITION } from '../definitions/save-solved-test';
import { SHARE_TEST_CLOUD_FN_DEFINITION } from '../definitions/share-test';
import { CloudFunctionsDefinitions } from '../types/functions-definitions';

export const CLOUD_FUNCTIONS_DEFINITIONS: CloudFunctionsDefinitions =
  Object.freeze({
    shareTest: SHARE_TEST_CLOUD_FN_DEFINITION,
    saveSolvedTest: SAVE_SOLVED_TEST_CLOUD_FN_DEFINITION,
    saveAnswersKeys: SAVE_ANSWERS_KEYS_CLOUD_FN_DEFINITION,
    evaluateSolvedTestAnswers: EVALUATE_SOLVED_TEST_ANSWERS_CLOUD_FN_DEFINITION,
  });
