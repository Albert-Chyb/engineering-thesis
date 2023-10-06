import { Answer } from './answer';

interface QuestionsContentsTypesMap {
  'single-choice': {
    question: string;
    answer: string;
  };
  'multi-choice': {
    question: string;
    answer: string;
  };
  open: {
    question: string;
    answer: null;
  };
}

export type QuestionsTypes = keyof QuestionsContentsTypesMap;

interface QuestionBase<TContent extends keyof QuestionsContentsTypesMap> {
  id: string;
  type: QuestionsTypes;
  content: QuestionsContentsTypesMap[TContent]['question'];
}

export interface OpenQuestion extends QuestionBase<'open'> {}

export interface ClosedQuestion<
  TQuestionContent extends keyof QuestionsContentsTypesMap
> extends QuestionBase<TQuestionContent> {
  answers: Answer<QuestionsContentsTypesMap[TQuestionContent]['answer']>[];
}

export type QuestionReadPayload<
  TContent extends keyof QuestionsContentsTypesMap
> = Omit<ClosedQuestion<TContent>, 'id'> | Omit<OpenQuestion, 'id'>;

export type QuestionCreatePayload<
  TContent extends keyof QuestionsContentsTypesMap
> = Omit<ClosedQuestion<TContent>, 'id'> | Omit<OpenQuestion, 'id'>;
