import { QuestionsContentsTypesMap } from './questions-contents-types';

export interface Answer<QuestionType extends keyof QuestionsContentsTypesMap> {
  id: string;
  content: QuestionsContentsTypesMap[QuestionType]['answer'];
}

export type RawAnswer<QuestionType extends keyof QuestionsContentsTypesMap> =
  Omit<Answer<QuestionType>, 'id'>;
