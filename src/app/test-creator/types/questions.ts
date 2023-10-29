/**
 * This type contains contents types of each question type and its answers.
 * Each question type has its own content type.
 */
export type QuestionsContentsTypes = {
  'multi-choice': {
    questionContentType: string;
    answerContentType: string;
  };
  'single-choice': {
    questionContentType: string;
    answerContentType: string;
  };
  'text-answer': {
    questionContentType: string;
    answerContentType: never;
  };
};

/**
 * This type contains all question types.
 */
export type QuestionsTypes = keyof QuestionsContentsTypes;

/**
 * This type contains all closed question types.
 */
export type ClosedQuestionsTypes = Exclude<QuestionsTypes, 'text-answer'>;

/**
 * This type contains all open question types.
 */
export type OpenQuestionsTypes = Exclude<
  QuestionsTypes,
  'multi-choice' | 'single-choice'
>;
