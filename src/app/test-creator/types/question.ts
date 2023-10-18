import { QuestionsContentsTypesMap } from './questions-contents-types';

export type QuestionsTypes = keyof QuestionsContentsTypesMap;

export type Question<QuestionType extends QuestionsTypes> = {
  id: string;
  type: QuestionsTypes;
  content: QuestionsContentsTypesMap[QuestionType]['question'];
};

export type QuestionReadPayload<QuestionType extends QuestionsTypes> = Omit<
  Question<QuestionType>,
  'id'
>;

export type QuestionCreatePayload<QuestionType extends QuestionsTypes> = Omit<
  Question<QuestionType>,
  'id'
>;