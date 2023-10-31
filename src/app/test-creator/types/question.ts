import { QuestionsContentsTypes, QuestionsTypes } from './questions';

/** Object of a question that a service returns and accepts. */
export interface Question<TQuestionType extends QuestionsTypes> {
  id: string;
  type: TQuestionType;
  content: QuestionsContentsTypes[TQuestionType]['questionContentType'];
  position: number;
}

/** Object of a question that is stored in the database. */
export type RawQuestion<TQuestionType extends QuestionsTypes> = Omit<
  Question<TQuestionType>,
  'id'
>;
