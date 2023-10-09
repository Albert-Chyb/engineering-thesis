import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { QuestionFormGroup } from './question-form-group';

export type TestFormGroup = FormGroup<{
  name: FormControl<string | null>;
  questions: FormArray<QuestionFormGroup>;
}>;
