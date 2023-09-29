import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AnswerFormGroup } from './answer-form-group';

export type QuestionFormGroup = FormGroup<{
  id: FormControl<string | null>;
  content: FormControl<string | null>;
  answers: FormArray<AnswerFormGroup>;
  type: FormControl<string | null>;
}>;
