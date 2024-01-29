import { AnswerValue, QuestionsTypes } from '../types/editor-config';
import { Question } from './question';

export abstract class TestEditor {
  private readonly questions: Question<QuestionsTypes>[] = [];

  constructor(public name: string) {}

  addQuestion(question: Question<QuestionsTypes>) {
    this.questions.push(question);
  }

  deleteQuestion(id: string) {
    const questionIndex = this.questions.findIndex((q) => q.id === id);

    if (questionIndex === -1) {
      throw new Error(`Could not find question with id "${id}"`);
    }

    this.questions.splice(questionIndex, 1);
  }

  generateAnswers(): Record<string, AnswerValue<QuestionsTypes>> {
    return Object.fromEntries(
      this.questions.map((q) => [q.id, q.generateAnswer()]),
    );
  }
}
