import { QuestionsTypes } from '@utils/firestore/models/questions.model';
import { AssociatedAnswer } from '../types/editor-config';

export abstract class Answer<TQuestionType extends QuestionsTypes> {
  constructor(
    public readonly id: string,
    public content: string,
  ) {}

  /**
   * Returns a copy of the answer with a new reference.
   */
  abstract copy(): AssociatedAnswer<TQuestionType>;
}
