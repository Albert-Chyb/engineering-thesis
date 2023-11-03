import { QuestionDoc } from '@test-creator/types/question';
import {
  ClosedQuestionsTypes,
  OpenQuestionsTypes,
  QuestionsTypes,
} from '@test-creator/types/questions';

export type QuestionMetadata = {
  name: string;
  shortName: string;
  icon: string;
};

export type QuestionsMetadataDictionary = {
  [T in QuestionsTypes]: QuestionMetadata;
};

const questionsMetadata: QuestionsMetadataDictionary = Object.freeze({
  'multi-choice': {
    name: 'Pytanie wielokrotnego wyboru',
    shortName: 'Wielokrotny wybór',
    icon: 'check_box',
  },
  'single-choice': {
    name: 'Pytanie jednokrotnego wyboru',
    shortName: 'Jednokrotny wybór',
    icon: 'radio_button_checked',
  },
  'text-answer': {
    name: 'Pytanie otwarte',
    shortName: 'Otwarte',
    icon: 'text_fields',
  },
});

export class Question<TQuestionType extends QuestionsTypes>
  implements QuestionDoc<TQuestionType>
{
  private readonly metadata: QuestionMetadata;
  readonly id: string;
  readonly type: TQuestionType;
  readonly content: string;
  readonly position: number;

  constructor(doc: QuestionDoc<TQuestionType>) {
    this.id = doc.id;
    this.type = doc.type;
    this.content = doc.content;
    this.position = doc.position;

    this.metadata = { ...questionsMetadata[this.type] };
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
