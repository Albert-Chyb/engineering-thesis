interface QuestionBase {
  content: string;
  position: number;
}

export interface SingleChoiceQuestion extends QuestionBase {
  type: 'single-choice';
}

export interface MultiChoiceQuestion extends QuestionBase {
  type: 'multi-choice';
}

export interface TextAnswerQuestion extends QuestionBase {
  type: 'text-answer';
}

export type RawQuestion =
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | TextAnswerQuestion;

export type QuestionDoc = RawQuestion & { id: string };

export type QuestionsTypes = RawQuestion['type'];
export type ClosedQuestionsTypes = Exclude<QuestionsTypes, 'text-answer'>;
export type OpenQuestionsTypes = Exclude<QuestionsTypes, ClosedQuestionsTypes>;
