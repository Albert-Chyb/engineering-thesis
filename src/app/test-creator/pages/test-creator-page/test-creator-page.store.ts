import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { answersGenerators } from '@test-creator/constants/answers-generators';
import { questionsGenerators } from '@test-creator/constants/questions-generators';
import { Answer } from '@test-creator/types/answer';
import { Question } from '@test-creator/types/question';
import {
  ClosedQuestionsTypes,
  QuestionsTypes,
} from '@test-creator/types/questions';
import {
  QuestionFormGroup,
  TestForm,
} from '@test-creator/types/test-creator-form';

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
