import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Answer } from '@test-creator/types/answer';
import { Question } from '@test-creator/types/question';
import {
  ClosedQuestionsTypes,
  QuestionsTypes,
} from '@test-creator/types/questions';
import {
  AnswerFormGroup,
  OpenQuestionFormGroup,
  TestForm,
  TestFormControlsGenerators,
} from '@test-creator/types/test-creator-form';

const testFormControlsGenerator: TestFormControlsGenerators = {
  'single-choice': {
    generateAnswer: () =>
      new FormGroup({
        id: new FormControl(crypto.randomUUID() as string, {
          nonNullable: true,
        }),
        content: new FormControl(''),
      }) as AnswerFormGroup<'single-choice'>,
    generateQuestion: () =>
      new FormGroup({
        id: new FormControl(crypto.randomUUID() as string, {
          nonNullable: true,
        }),
        content: new FormControl(''),
        type: new FormControl('single-choice', { nonNullable: true }),
        answers: new FormArray<AnswerFormGroup<'single-choice'>>([]),
      }),
  },
  'multi-choice': {
    generateAnswer: () =>
      new FormGroup({
        id: new FormControl(crypto.randomUUID() as string, {
          nonNullable: true,
        }),
        content: new FormControl(''),
      }) as AnswerFormGroup<'single-choice'>,
    generateQuestion: () =>
      new FormGroup({
        id: new FormControl(crypto.randomUUID() as string, {
          nonNullable: true,
        }),
        content: new FormControl(''),
        type: new FormControl('multi-choice', { nonNullable: true }),
        answers: new FormArray<AnswerFormGroup<'multi-choice'>>([]),
      }),
  },
  'text-answer': {
    generateQuestion: () =>
      new FormGroup({
        id: new FormControl(crypto.randomUUID() as string, {
          nonNullable: true,
        }),
        content: new FormControl(''),
        type: new FormControl('text-answer', { nonNullable: true }),
      }) as OpenQuestionFormGroup<'text-answer'>,
  },
};

interface TestCreatorPageState {
  testForm: TestForm;
}

export class TestCreatorPageStore extends ComponentStore<TestCreatorPageState> {
  constructor() {
    super();
  }

  private generateQuestion<TQuestionType extends QuestionsTypes>(
    question: Question<TQuestionType>
  ) {
    const generator = testFormControlsGenerator[question.type];
    const formGroup = generator.generateQuestion(question);

    return formGroup;
  }

  private generateAnswer<TQuestionType extends ClosedQuestionsTypes>(
    type: TQuestionType,
    answer: Answer<TQuestionType>
  ) {
    const generator = testFormControlsGenerator[type];
    const formGroup = generator.generateAnswer(answer);

    return formGroup;
  }
}
