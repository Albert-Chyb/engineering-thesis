import { QuestionsTypes } from '@utils/firestore/models/questions.model';

export type QuestionMetadata<TQuestionType extends QuestionsTypes> = {
  type: TQuestionType;
  name: string;
  shortName: string;
  icon: string;
};

export type QuestionsMetadataDictionary = {
  [T in QuestionsTypes]: QuestionMetadata<T>;
};

const questionsMetadataDict: QuestionsMetadataDictionary = Object.freeze({
  'multi-choice': {
    type: 'multi-choice',
    name: 'Pytanie wielokrotnego wyboru',
    shortName: 'Wielokrotny wybór',
    icon: 'check_box',
  },
  'single-choice': {
    type: 'single-choice',
    name: 'Pytanie jednokrotnego wyboru',
    shortName: 'Jednokrotny wybór',
    icon: 'radio_button_checked',
  },
  'text-answer': {
    type: 'text-answer',
    name: 'Pytanie otwarte',
    shortName: 'Otwarte',
    icon: 'text_fields',
  },
});

class QuestionsMetadata {
  constructor(private readonly dictionary: QuestionsMetadataDictionary) {}

  getMetadata<TQuestionType extends QuestionsTypes>(
    type: TQuestionType,
  ): QuestionMetadata<TQuestionType> {
    return { ...this.dictionary[type] };
  }

  getMetadataForAllTypes(): QuestionMetadata<QuestionsTypes>[] {
    return Object.values(this.dictionary);
  }
}

export const questionsMetadata = new QuestionsMetadata(questionsMetadataDict);
