export const AllQuestionsTypes = [
  'single-choice',
  'multi-choice',
  'text-answer',
] as const;

export const ClosedQuestionsTypes = ['single-choice', 'multi-choice'] as const;

export const OpenQuestionsTypes = ['text-answer'] as const;
