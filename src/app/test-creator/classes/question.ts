import { QuestionDoc } from '@test-creator/types/question';
import {
  ClosedQuestionsTypes,
  OpenQuestionsTypes,
  QuestionsTypes,
} from '@test-creator/types/questions';
import { QuestionMetadata, questionsMetadata } from './questions-metadata';

export class Question<TQuestionType extends QuestionsTypes>
  implements QuestionDoc<TQuestionType>
{
  private readonly metadata: QuestionMetadata<TQuestionType>;
  readonly id: string;
  readonly type: TQuestionType;
  readonly content: string;
  readonly position: number;

  constructor(doc: QuestionDoc<TQuestionType>) {
    this.id = doc.id;
    this.type = doc.type;
    this.content = doc.content;
    this.position = doc.position;

    this.metadata = questionsMetadata.getMetadata(this.type);
  }

  /** The name for the type of the question */
  get name(): string {
    return this.metadata.name;
  }

  /** The short name for the type of the question */
  get shortName(): string {
    return this.metadata.shortName;
  }

  /** The material icon name for the type of the question */
  get icon(): string {
    return this.metadata.icon;
  }

  /** Checks if this question is of a closed kind */
  isClosedQuestion(): this is QuestionDoc<ClosedQuestionsTypes> {
    return Question.getClosedQuestionsTypes().includes(this.type as any);
  }

  /** Checks if this question is of an opened kind */
  isOpenQuestion(): this is QuestionDoc<OpenQuestionsTypes> {
    return Question.getOpenQuestionsTypes().includes(this.type as any);
  }

  /** Returns the abstract type of the question */
  getAbstractType(): 'closed' | 'open' {
    if (this.isClosedQuestion()) {
      return 'closed';
    } else {
      return 'open';
    }
  }

  /** Returns the question document. */
  toDoc(): QuestionDoc<TQuestionType> {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
      position: this.position,
    };
  }

  /** Returns all question types */
  static getQuestionsTypes(): QuestionsTypes[] {
    return ['multi-choice', 'single-choice', 'text-answer'];
  }

  /** Returns all closed question types */
  static getClosedQuestionsTypes(): ClosedQuestionsTypes[] {
    return ['multi-choice', 'single-choice'];
  }

  /** Returns all open question types */
  static getOpenQuestionsTypes(): OpenQuestionsTypes[] {
    return ['text-answer'];
  }
}
