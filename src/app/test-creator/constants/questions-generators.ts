import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Question } from '@test-creator/types/question';
import {
  AnswerFormGroup,
  OpenQuestionFormGroup,
  QuestionsGenerators,
} from '@test-creator/types/test-creator-form';

export const questionsGenerators: QuestionsGenerators = {
  'single-choice': {
    generate: (question: Question<'single-choice'>) =>
      new FormGroup({
        id: new FormControl(question.id, {
          nonNullable: true,
        }),
        content: new FormControl(question.content),
        type: new FormControl(question.type, { nonNullable: true }),
        answers: new FormArray<AnswerFormGroup<'single-choice'>>([]),
      }),
  },
  'multi-choice': {
    generate: (question: Question<'multi-choice'>) =>
      new FormGroup({
        id: new FormControl(question.id, {
          nonNullable: true,
        }),
        content: new FormControl(question.content),
        type: new FormControl(question.type, { nonNullable: true }),
        answers: new FormArray<AnswerFormGroup<'multi-choice'>>([]),
      }),
  },
  'text-answer': {
    generate: (question: Question<'text-answer'>) =>
      new FormGroup({
        id: new FormControl(question.id, {
          nonNullable: true,
        }),
        content: new FormControl(question.content),
        type: new FormControl(question.type, { nonNullable: true }),
      }) as OpenQuestionFormGroup<'text-answer'>,
  },
};
