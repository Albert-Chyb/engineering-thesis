import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Answer } from './answer';
import { Question } from './question';
import {
  ClosedQuestionsTypes,
  OpenQuestionsTypes,
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
    id: FormControl<string>;
    content: FormControl<
      QuestionsContentsTypes[TQuestionType]['answerContentType'] | null
    >;
  }>;

/**
 * The question form group type for closed questions.
 *
 * This type needs a closed question type to determine the content type of answers.
 */
export type ClosedQuestionFormGroup<
  TQuestionType extends ClosedQuestionsTypes
> = FormGroup<{
  id: FormControl<string>;
  content: FormControl<
    QuestionsContentsTypes[TQuestionType]['questionContentType'] | null
  >;
  type: FormControl<TQuestionType>;
  answers: FormArray<AnswerFormGroup<TQuestionType>>;
}>;

/**
 * The question form group type for open questions.
 */
export type OpenQuestionFormGroup<TQuestionType extends OpenQuestionsTypes> =
  FormGroup<{
    id: FormControl<string>;
    content: FormControl<
      QuestionsContentsTypes[TQuestionType]['questionContentType'] | null
    >;
    type: FormControl<QuestionsTypes>;
  }>;

/** Determines the right type of the question form group based on the passed question type */
export type QuestionFormGroup<TQuestionType extends QuestionsTypes> =
  TQuestionType extends ClosedQuestionsTypes
    ? ClosedQuestionFormGroup<TQuestionType>
    : TQuestionType extends OpenQuestionsTypes
    ? OpenQuestionFormGroup<TQuestionType>
    : never;

/**
 * The test form group type.
 */
export type TestForm = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string | null>;
  questions: FormArray<
    | OpenQuestionFormGroup<OpenQuestionsTypes>
    | ClosedQuestionFormGroup<ClosedQuestionsTypes>
  >;
}>;

export type QuestionGenerator<TQuestionType extends QuestionsTypes> = {
  generate: (
    question: Question<TQuestionType>
  ) => QuestionFormGroup<TQuestionType>;
};

export type QuestionsGenerators = {
  [K in QuestionsTypes]: QuestionGenerator<K>;
};

export type AnswerGenerator<TQuestionType extends ClosedQuestionsTypes> = {
  generate: (answer: Answer<TQuestionType>) => AnswerFormGroup<TQuestionType>;
};

export type AnswersGenerators = {
  [K in ClosedQuestionsTypes]: {
    generate: (answer: Answer<K>) => AnswerFormGroup<K>;
  };
};
