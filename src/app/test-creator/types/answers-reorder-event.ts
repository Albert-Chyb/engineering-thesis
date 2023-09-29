import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormArray } from '@angular/forms';
import { AnswerFormGroup } from './answer-form-group';

export type AnswersReorderEvent = { questionIndex: number } & Pick<
  CdkDragDrop<FormArray<any>, FormArray<any>, AnswerFormGroup>,
  'previousIndex' | 'currentIndex'
>;
