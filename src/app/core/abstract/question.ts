import { AnswerValue, QuestionsTypes } from '../types/editor-config';

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
