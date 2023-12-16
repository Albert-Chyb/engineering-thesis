import { FormControl, FormGroup } from '@angular/forms';

/**
 * The answer form group type for an individual question type.
 *
 * This type needs closed question type to determine the answer content type.
 */
export type AnswerFormGroup = FormGroup<{
  content: FormControl<string | null>;
}>;

/**
 * A form group for a question.
 */
export type QuestionFormGroup = FormGroup<{
  content: FormControl<string | null>;
}>;

/**
 * The test form group type.
 */
export type TestForm = FormGroup<{
  name: FormControl<string>;
}>;
