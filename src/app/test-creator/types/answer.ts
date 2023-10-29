import { ClosedQuestionsTypes, QuestionsContentsTypes } from './questions';

export interface Answer<TQuestionType extends ClosedQuestionsTypes> {
  id: string;
  content: QuestionsContentsTypes[TQuestionType]['answerContentType'];
}

export type RawAnswer<QuestionType extends ClosedQuestionsTypes> = Omit<
  Answer<QuestionType>,
  'id'
>;
