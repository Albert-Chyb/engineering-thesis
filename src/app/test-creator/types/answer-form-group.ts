import { FormControl, FormGroup } from '@angular/forms';

export type AnswerFormGroup = FormGroup<{
  content: FormControl<string | null>;
  id: FormControl<string | null>;
}>;
