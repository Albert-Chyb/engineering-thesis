import { ClosedQuestionsTypes } from '@utils/firestore/models/questions.model';
import { AssociatedAnswer } from '../types/editor-config';
import { Question } from './question';

export abstract class ClosedQuestion<
  TQuestionType extends ClosedQuestionsTypes,
> extends Question<TQuestionType> {
  private readonly answers: AssociatedAnswer<TQuestionType>[] = [];

  /**
   * Adds a possible answer to this question.
   * @param answer The answer object.
   */
  addAnswer(answer: AssociatedAnswer<TQuestionType>) {
    this.answers.push(answer);
  }

  /**
   * Deletes a possible answer from this question.
   * @param id The id of the answer to delete.
   */
  deleteAnswer(id: string) {
    const answerIndex = this.answers.findIndex((a) => a.id === id);

    if (answerIndex === -1) {
      throw new Error(`Could not find an answer with id "${id}"`);
    }

    this.answers.splice(answerIndex, 1);
  }

  /**
   * Checks whether this question has any answers.
   * @returns Whether this question has any answers.
   */
  hasAnswers(): boolean {
    return this.answers.length > 0;
  }

  /**
   * Returns a copy of the answers array with a new reference.
   * @returns Answer array.
   */
  getAnswers(): AssociatedAnswer<TQuestionType>[] {
    return this.answers.map((a) => a.copy());
  }
}
