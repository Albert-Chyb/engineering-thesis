export interface QuestionsContentsTypesMap {
  'single-choice': {
    question: string;
    answer: string;
  };
  'multi-choice': {
    question: string;
    answer: string;
  };
  open: {
    question: string;
    answer: null;
  };
}
