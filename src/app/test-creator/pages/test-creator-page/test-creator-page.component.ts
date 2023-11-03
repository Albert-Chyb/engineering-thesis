import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { Question } from '@test-creator/classes/question';
import { QuestionWrapperComponent } from '@test-creator/components/question-wrapper/question-wrapper.component';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { QuestionsTypes } from '@test-creator/types/questions';
import { debounceTime, map, tap } from 'rxjs';
import { TestCreatorPageStore } from './test-creator-page.store';

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
    MatIconModule,
    MatMenuModule,
    QuestionWrapperComponent,
    DragDropModule,
  ],
  templateUrl: './test-creator-page.component.html',
  styleUrls: ['./test-creator-page.component.scss'],
  providers: [TestCreatorPageStore],
})
export class TestCreatorPageComponent {
  private readonly testsService = inject(UserTestsService);
  private readonly store = inject(TestCreatorPageStore);
  private readonly route = inject(ActivatedRoute);

  readonly test = this.store.test;
  readonly questions = this.store.questions;
  readonly questionsMetadata = this.store.questionsMetadata;

  readonly testForm = new FormGroup({
    name: new FormControl(''),
  });

  private readonly syncStoreWithForm = effect(() => {
    const test = this.store.test();

    if (!test) {
      return;
    }

    this.testForm.patchValue(test, { emitEvent: false });
  });

  constructor() {
    this.store.loadTestData(
      this.route.params.pipe(map((params) => params['id']))
    );

    this.store.saveTest(
      this.testForm.valueChanges.pipe(
        map((value) => ({
          id: this.test()?.id ?? '',
          name: value.name ?? '',
        })),
        tap((value) => this.store.updateTest(value)),
        debounceTime(500)
      )
    );
  }

  getNewQuestionPosition(questions: Question<QuestionsTypes>[]) {
    return (questions.at(-1)?.position ?? 0) + 1;
  }

  handleUpdateQuestion(updatedQuestion: Question<QuestionsTypes>) {
    this.store.updateQuestion(updatedQuestion);
    this.store.saveQuestion(updatedQuestion);
  }

  handleAddQuestion<TQuestionType extends QuestionsTypes>(
    type: TQuestionType,
    position: number
  ) {
    const newQuestion: Question<TQuestionType> = new Question({
      id: this.testsService.generateId(),
      type,
      content: 'Nowe pytanie',
      position,
    });

    this.store.addQuestion(newQuestion);
    this.store.saveQuestion(newQuestion);
  }

  handleDeleteQuestion(question: Question<QuestionsTypes>) {
    this.store.deleteQuestion(question);
    this.store.deleteQuestionFromDb(question);
  }

  handleQuestionsPositionsSwap(
    $event: CdkDragDrop<
      Question<QuestionsTypes>[],
      Question<QuestionsTypes>[],
      Question<QuestionsTypes>
    >
  ) {
    const prevIndex = $event.previousIndex;
    const currentIndex = $event.currentIndex;
    const questions = this.questions();
    const question1 = questions[prevIndex];
    const question2 = questions[currentIndex];
    const swap = { from: question1, to: question2 };

    this.store.swapQuestionsOnDb(swap);
    this.store.swapQuestions(swap);
  }

  trackByQuestionId(index: number, question: Question<QuestionsTypes>) {
    return question.id;
  }
}
