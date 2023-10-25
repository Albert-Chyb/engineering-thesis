import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AnswerFormGroup } from './answer-form-group';
import { QuestionsTypes } from './question';

export type QuestionFormGroup<TQuestionType extends QuestionsTypes> =
  FormGroup<{
    id: FormControl<string>;
    content: FormControl<string | null>;
    type: FormControl<TQuestionType>;
    answers: FormArray<AnswerFormGroup>;
  }>;
