import { Answer } from './answer';
import { QuestionsContentsTypesMap } from './questions-contents-types';

export type QuestionsTypes = keyof QuestionsContentsTypesMap;

interface QuestionBase<QuestionType extends keyof QuestionsContentsTypesMap> {
  id: string;
  type: QuestionsTypes;
  content: QuestionsContentsTypesMap[QuestionType]['question'];
}

export interface OpenQuestion extends QuestionBase<'open'> {}

export interface ClosedQuestion<
  QuestionType extends keyof QuestionsContentsTypesMap
> extends QuestionBase<QuestionType> {
  answers: Answer<QuestionType>[];
}

export type QuestionReadPayload<
  QuestionType extends keyof QuestionsContentsTypesMap
> = Omit<ClosedQuestion<QuestionType>, 'id'> | Omit<OpenQuestion, 'id'>;

export type QuestionCreatePayload<
  QuestionType extends keyof QuestionsContentsTypesMap
> = Omit<ClosedQuestion<QuestionType>, 'id'> | Omit<OpenQuestion, 'id'>;
