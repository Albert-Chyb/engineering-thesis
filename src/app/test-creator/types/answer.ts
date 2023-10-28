import { QuestionsTypes } from './question';
import { QuestionsContentsTypesMap } from './questions-contents-types';

export interface Answer<QuestionType extends QuestionsTypes> {
  id: string;
  content: QuestionsContentsTypesMap[QuestionType]['answer'];
}

export type RawAnswer<QuestionType extends QuestionsTypes> = Omit<
  Answer<QuestionType>,
  'id'
>;
