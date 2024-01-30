import { OpenQuestionsTypes } from '@utils/firestore/models/questions.model';
import { AssociatedAnswer } from '../types/editor-config';
import { Question } from './question';

export abstract class OpenEndedQuestion<
  TQuestionType extends OpenQuestionsTypes,
> extends Question<TQuestionType> {
  private answer: AssociatedAnswer<TQuestionType> | null = null;

  /**
   * Sets the answer for this question.
   * @param answer The answer object.
   */
  setAnswer(answer: AssociatedAnswer<TQuestionType>): void {
    this.answer = answer;
  }

  /**
   * Returns a copy of the answer with a new reference.
   * @returns A copy of the answer with a new reference.
   */
  getAnswer(): AssociatedAnswer<TQuestionType> | null {
    return this.answer?.copy() || null;
  }

  /**
   * Checks if this question has an answer.
   * @returns Whether this question has an answer.
   */
  hasAnswer(): boolean {
    return this.answer !== null;
  }

  /**
   * Deletes the answer for this question.
   */
  deleteAnswer(): void {
    this.answer = null;
  }
}
