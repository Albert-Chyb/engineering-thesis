import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { OpenQuestionComponent } from '@test-creator/components/open-question/open-question.component';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { AnswerFormGroup } from '@test-creator/types/answer-form-group';
import { AnswersReorderEvent } from '@test-creator/types/answers-reorder-event';
import { QuestionsTypes } from '@test-creator/types/question';

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
    OpenQuestionComponent,
  ],
  templateUrl: './test-creator-page.component.html',
  styleUrls: ['./test-creator-page.component.scss'],
})
export class TestCreatorPageComponent {
  readonly testForm = new FormGroup({
    name: new FormControl('Test bez nazwy'),
    questions: new FormArray([
      this.createQuestion('open'),
      this.createQuestion('single-choice'),
      this.createQuestion('multi-choice'),
    ]),
  });

  constructor() {
    const tests = inject(UserTestsService);

    console.log(tests.generateId());
  }

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

  private createQuestion(type: QuestionsTypes) {
    if (type === 'open') {
      return new FormGroup({
        type: new FormControl(type),
        content: new FormControl(
          'Jaka jest twoja opinia na temat tego testu ?'
        ),
      });
    }

    return new FormGroup({
      type: new FormControl(type),
      content: new FormControl('Co to jest HTML ?'),
      answers: new FormArray([
        new FormGroup({
          content: new FormControl('Język programowania'),
        }),
        new FormGroup({
          content: new FormControl('Język znaczników'),
        }),
        new FormGroup({
          content: new FormControl('Język skryptowy'),
        }),
        new FormGroup({
          content: new FormControl('Język do tworzenia stron internetowych'),
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
