import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { QuestionFormGroup } from './question-form-group';
import { QuestionsTypes } from './question';

export type TestFormGroup = FormGroup<{
  name: FormControl<string | null>;
  questions: FormArray<QuestionFormGroup<QuestionsTypes>>;
}>;
