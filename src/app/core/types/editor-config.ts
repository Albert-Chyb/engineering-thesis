import { QuestionsTypes } from '@utils/firestore/models/questions.model';
import { CheckableAnswer } from '../answers/checkable';
import { TextAnswer } from '../answers/text';
import { MultiChoiceQuestion } from '../questions/multi-choice';
import { SingleChoiceQuestion } from '../questions/single-choice';
import { TextQuestion } from '../questions/text-answer';

type QuestionsEditorsConfig = {
  'single-choice': {
    Question: SingleChoiceQuestion;
    Answer: CheckableAnswer;
    answerValue: string;
  };
  'multi-choice': {
    Question: MultiChoiceQuestion;
    Answer: CheckableAnswer;
    answerValue: string[];
  };
  'text-answer': {
    Question: TextQuestion;
    Answer: TextAnswer;
    answerValue: string;
  };
};

/**
 * Object of an answer associated with a question.
 */
export type AssociatedAnswer<TQuestionType extends QuestionsTypes> =
  QuestionsEditorsConfig[TQuestionType]['Answer'];

/**
 * Shape of an answer for a single question.
 */
export type AnswerValue<TQuestionType extends QuestionsTypes> =
  | QuestionsEditorsConfig[TQuestionType]['answerValue']
  | null;

/**
 * Shape of an object with answers for each question in a test. Each key represents a question id.
 */
export type GeneratedAnswers = Record<string, AssociatedAnswer<QuestionsTypes>>;
