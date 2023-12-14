import { OpenQuestionsTypes } from '../constants/questions-types';

export function isOpenQuestion(questionType: string) {
  return OpenQuestionsTypes.includes(questionType as any);
}
