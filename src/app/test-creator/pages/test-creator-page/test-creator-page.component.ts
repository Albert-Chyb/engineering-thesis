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
import { ActivatedRoute, Router } from '@angular/router';
import { ChoiceQuestionComponent } from '@test-creator/components/choice-question/choice-question.component';
import { OpenQuestionComponent } from '@test-creator/components/open-question/open-question.component';
import { AnswersService } from '@test-creator/services/answers/answers.service';
import { QuestionsService } from '@test-creator/services/questions/questions.service';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { AnswerFormGroup } from '@test-creator/types/answer-form-group';
import { AnswersReorderEvent } from '@test-creator/types/answers-reorder-event';
import { QuestionsTypes } from '@test-creator/types/question';
import { Observable, map, of, switchMap, throwError } from 'rxjs';

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
  private readonly userTests = inject(UserTestsService);
  private readonly testQuestions = inject(QuestionsService);
  private readonly questionsAnswers = inject(AnswersService);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly testId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => {
      if (!id) {
        return throwError(() => new Error('Test id is not provided.'));
      } else {
        return of(id);
      }
    })
  );

  readonly testForm = new FormGroup({
    name: new FormControl('Test bez nazwy'),
    questions: new FormArray([
      this.createQuestion('open'),
      this.createQuestion('single-choice'),
      this.createQuestion('multi-choice'),
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
