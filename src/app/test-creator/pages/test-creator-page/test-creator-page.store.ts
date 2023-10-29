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
  AnswersGenerators,
  OpenQuestionFormGroup,
  QuestionFormGroup,
  QuestionsGenerators,
  TestForm,
} from '@test-creator/types/test-creator-form';

const questionsGenerators: QuestionsGenerators = {
  'single-choice': {
    generate: (question: Question<'single-choice'>) =>
      new FormGroup({
        id: new FormControl(question.id, {
          nonNullable: true,
        }),
        content: new FormControl(question.content),
        type: new FormControl(question.type, { nonNullable: true }),
        answers: new FormArray<AnswerFormGroup<'single-choice'>>([]),
      }),
  },
  'multi-choice': {
    generate: (question: Question<'multi-choice'>) =>
      new FormGroup({
        id: new FormControl(question.id, {
          nonNullable: true,
        }),
        content: new FormControl(question.content),
        type: new FormControl(question.type, { nonNullable: true }),
        answers: new FormArray<AnswerFormGroup<'multi-choice'>>([]),
      }),
  },
  'text-answer': {
    generate: (question: Question<'text-answer'>) =>
      new FormGroup({
        id: new FormControl(question.id, {
          nonNullable: true,
        }),
        content: new FormControl(question.content),
        type: new FormControl(question.type, { nonNullable: true }),
      }) as OpenQuestionFormGroup<'text-answer'>,
  },
};

const answersGenerators: AnswersGenerators = {
  'single-choice': {
    generate: (answer: Answer<'single-choice'>) =>
      new FormGroup({
        id: new FormControl(answer.id, {
          nonNullable: true,
        }),
        content: new FormControl(answer.content),
      }),
  },
  'multi-choice': {
    generate: (answer: Answer<'multi-choice'>) =>
      new FormGroup({
        id: new FormControl(answer.id, {
          nonNullable: true,
        }),
        content: new FormControl(answer.content),
      }),
  },
};

interface TestCreatorPageState {
  testForm: TestForm;
}

const INITIAL_STATE: TestCreatorPageState = {
  testForm: new FormGroup({
    id: new FormControl('', { nonNullable: true }),
    name: new FormControl(''),
    questions: new FormArray<QuestionFormGroup<QuestionsTypes>>([]),
  }),
};

export class TestCreatorPageStore extends ComponentStore<TestCreatorPageState> {
  constructor() {
    super(INITIAL_STATE);
  }

  private generateQuestion<TQuestionType extends QuestionsTypes>(
    question: Question<TQuestionType>
  ) {
    const generator = this.getQuestionGenerator(question.type);
    const formGroup = generator.generate(question);

    return formGroup;
  }

  private generateAnswer<TQuestionType extends ClosedQuestionsTypes>(
    type: TQuestionType,
    answer: Answer<TQuestionType>
  ) {
    const generator = this.getAnswerGenerator(type);
    const formGroup = generator.generate(answer);

    return formGroup;
  }

  private getQuestionGenerator<TQuestionType extends QuestionsTypes>(
    type: TQuestionType
  ) {
    return questionsGenerators[type];
  }

  private getAnswerGenerator<TQuestionType extends ClosedQuestionsTypes>(
    type: TQuestionType
  ) {
    return answersGenerators[type];
  }
}
