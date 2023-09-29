import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { QuestionFormGroup } from './question-form-group';

export type TestFormGroup = FormGroup<{
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  questions: FormArray<QuestionFormGroup>;
}>;
