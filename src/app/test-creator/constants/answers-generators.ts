import { FormControl, FormGroup } from '@angular/forms';
import { Answer } from '@test-creator/types/answer';
import { AnswersGenerators } from '@test-creator/types/test-creator-form';

export const answersGenerators: AnswersGenerators = {
  'single-choice': {
    generate: (answer: Answer<'single-choice'>) =>
      new FormGroup({
        id: new FormControl(answer.id, {
          nonNullable: true,
        }),
        content: new FormControl(answer.content),
      }),
  },
  'multi-choice': {
    generate: (answer: Answer<'multi-choice'>) =>
      new FormGroup({
        id: new FormControl(answer.id, {
          nonNullable: true,
        }),
        content: new FormControl(answer.content),
      }),
  },
};
