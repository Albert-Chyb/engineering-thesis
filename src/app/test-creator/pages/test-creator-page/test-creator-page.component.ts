import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChoiceQuestionComponent } from '@test-creator/components/choice-question/choice-question.component';
import { AnswerFormGroup } from '@test-creator/types/answer-form-group';
import { AnswersReorderEvent } from '@test-creator/types/answers-reorder-event';
import { QuestionType } from '@test-creator/types/question-types';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ChoiceQuestionComponent,
  ],
  templateUrl: './test-creator-page.component.html',
  styleUrls: ['./test-creator-page.component.scss'],
})
export class TestCreatorPageComponent {
  readonly testForm = new FormGroup({
    id: new FormControl('1'),
    name: new FormControl('Test bez nazwy'),
    questions: new FormArray([
      this.createQuestion(QuestionType.SingleChoice),
      this.createQuestion(QuestionType.MultiChoice),
    ]),
  });

  handleAnswersReorder($event: AnswersReorderEvent) {
    const { previousIndex, currentIndex, questionIndex } = $event;
    const answers = this.testForm.get([
      'questions',
      questionIndex,
      'answers',
    ]) as FormArray<AnswerFormGroup>;

    this.swapControls(answers, previousIndex, currentIndex);
  }

  handleAddAnswer(index: number) {
    const answers = this.testForm.get([
      'questions',
      index,
      'answers',
    ]) as FormArray<AnswerFormGroup>;

    answers.push(
      new FormGroup({
        content: new FormControl(''),
        id: new FormControl(''),
      })
    );
  }

  handleDeleteAnswer([questionIndex, answerIndex]: [number, number]) {
    const answers = this.testForm.get([
      'questions',
      questionIndex,
      'answers',
    ]) as FormArray<AnswerFormGroup>;

    answers.removeAt(answerIndex);
  }

  private createQuestion(type: string) {
    return new FormGroup({
      id: new FormControl('1'),
      type: new FormControl(type),
      content: new FormControl('Co to jest HTML ?'),
      answers: new FormArray([
        new FormGroup({
          content: new FormControl('Język programowania'),
          id: new FormControl('1'),
        }),
        new FormGroup({
          content: new FormControl('Język znaczników'),
          id: new FormControl('2'),
        }),
        new FormGroup({
          content: new FormControl('Język skryptowy'),
          id: new FormControl('3'),
        }),
        new FormGroup({
          content: new FormControl('Język do tworzenia stron internetowych'),
          id: new FormControl('4'),
        }),
      ]),
    });
  }

  private swapControls(
    formArray: FormArray<any>,
    index1: number,
    index2: number
  ) {
    const temp = formArray.at(index1);

    formArray.removeAt(index1);
    formArray.insert(index2, temp);
  }
}
