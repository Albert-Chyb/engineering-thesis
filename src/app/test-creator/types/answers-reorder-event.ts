import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormArray } from '@angular/forms';
import { ClosedQuestionsTypes, QuestionsTypes } from './questions';
import { AnswerFormGroup, QuestionFormGroup } from './test-creator-form';

export type AnswersReorderEvent<TQuestionType extends ClosedQuestionsTypes> = {
  questionIndex: number;
} & Pick<
  CdkDragDrop<
    FormArray<QuestionFormGroup<QuestionsTypes>>,
    FormArray<QuestionFormGroup<QuestionsTypes>>,
    AnswerFormGroup<TQuestionType>
  >,
  'previousIndex' | 'currentIndex'
>;
