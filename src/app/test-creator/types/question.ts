import { QuestionsContentsTypesMap } from './questions-contents-types';

export type QuestionsTypes = keyof QuestionsContentsTypesMap;

/** Object of a question that a service returns and accepts. */
export interface Question<TQuestionType extends QuestionsTypes> {
  id: string;
  type: TQuestionType;
  content: QuestionsContentsTypesMap[TQuestionType]['question'];
}

/** Object of a question that is stored in the database. */
export type RawQuestion<TQuestionType extends QuestionsTypes> = Omit<
  Question<TQuestionType>,
  'id'
>;
