import { QuestionsTypes } from '@utils/firestore/models/questions.model';
import { AnswerValue } from '../types/editor-config';

export abstract class Question<TQuestionType extends QuestionsTypes> {
  constructor(
    public id: string,
    public content: string,
  ) {}

  /**
   * Answer given to this question.
   */
  abstract generateAnswer(): AnswerValue<TQuestionType>;
}
