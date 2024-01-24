import { ZodSchema } from 'zod';
import {
  EvaluateSolvedTestAnswersFnData,
  EvaluateSolvedTestAnswersFnResult,
} from '../definitions/evaluate-solved-test-answers';
import {
  SaveAnswersKeyCloudFnData,
  SaveAnswersKeyCloudFnResult,
} from '../definitions/save-answers-keys';
import {
  SaveSolvedTestCloudFnData,
  SaveSolvedTestCloudFnResult,
} from '../definitions/save-solved-test';
import {
  ShareTestCloudFnData,
  ShareTestCloudFnResult,
} from '../definitions/share-test';

type Config = {
  shareTest: {
    data: ShareTestCloudFnData;
    result: ShareTestCloudFnResult;
  };

  saveSolvedTest: {
    data: SaveSolvedTestCloudFnData;
    result: SaveSolvedTestCloudFnResult;
  };

  saveAnswersKeys: {
    data: SaveAnswersKeyCloudFnData;
    result: SaveAnswersKeyCloudFnResult;
  };

  evaluateSolvedTestAnswers: {
    data: EvaluateSolvedTestAnswersFnData;
    result: EvaluateSolvedTestAnswersFnResult;
  };
};

export type CloudFunctionsNames = keyof Config;

export type CloudFunctionDef<TName extends CloudFunctionsNames> = Config[TName];

export type CloudFunctionData<TName extends CloudFunctionsNames> =
  CloudFunctionDef<TName>['data'];

export type CloudFunctionResult<TName extends CloudFunctionsNames> =
  CloudFunctionDef<TName>['result'];

export type CloudFunctionDefinition<TName extends CloudFunctionsNames> = {
  dataSchema: ZodSchema<CloudFunctionData<TName>>;
  resultSchema: ZodSchema<CloudFunctionResult<TName>>;
};

export type CloudFunctionsDefinitions = {
  [TName in CloudFunctionsNames]: CloudFunctionDefinition<TName>;
};
