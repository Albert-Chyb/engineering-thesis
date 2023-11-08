import { FormControl, FormGroup } from '@angular/forms';
import {
  ClosedQuestionsTypes,
  QuestionsContentsTypes,
  QuestionsTypes,
} from './questions';

/**
 * The answer form group type for an individual question type.
 *
 * This type needs closed question type to determine the answer content type.
 */
export type AnswerFormGroup<TQuestionType extends ClosedQuestionsTypes> =
  FormGroup<{
    content: FormControl<
      QuestionsContentsTypes[TQuestionType]['answerContentType'] | null
    >;
  }>;

/**
 * A form group for a question.
 */
export type QuestionFormGroup<TQuestionType extends QuestionsTypes> =
  FormGroup<{
    content: FormControl<
      QuestionsContentsTypes[TQuestionType]['questionContentType'] | null
    >;
  }>;

/**
 * The test form group type.
 */
export type TestForm = FormGroup<{
  name: FormControl<string | null>;
}>;
