import { SolvedTestAnswer } from '../models/solved-test-answers';
import { QuestionsTypes } from '../models/test';

export function compareMultiChoiceAnswers(
  answers: [string[] | null, string[] | null],
) {
  const [firstArray, secondArray] = answers;

  if (!firstArray || !secondArray) {
    return false;
  }

  if (firstArray.length !== secondArray.length) {
    return false;
  }

  return firstArray.every((item) => secondArray.includes(item));
}

export function compareSingleChoiceAnswers(
  answers: [string | null, string | null],
) {
  const [firstAnswer, secondAnswer] = answers;

  if (!firstAnswer || !secondAnswer) {
    return false;
  }

  return firstAnswer === secondAnswer;
}

export function compareSolvedTestAnswers(
  questionType: QuestionsTypes,
  answers: [SolvedTestAnswer['answer'], SolvedTestAnswer['answer']],
) {
  switch (questionType) {
    case 'multi-choice':
      return compareMultiChoiceAnswers(answers as [string[], string[]]);

    case 'single-choice':
      return compareSingleChoiceAnswers(answers as [string, string]);

    default:
      return false;
  }
}
