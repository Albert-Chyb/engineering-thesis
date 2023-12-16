import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { NoDataInfoComponent } from '@common/components/no-data-info/no-data-info.component';
import { LoadingIndicatorComponent } from '@loading-indicator/components/loading-indicator/loading-indicator.component';
import { HasPendingTasks } from '@loading-indicator/guards/has-pending-tasks.guard';
import { PendingIndicatorService } from '@loading-indicator/services/pending-indicator.service';
import { Question } from '@test-creator/classes/question';
import { AnswerWrapperComponent } from '@test-creator/components/answer-wrapper/answer-wrapper.component';
import { QuestionWrapperComponent } from '@test-creator/components/question-wrapper/question-wrapper.component';
import { TestCreatorFormComponent } from '@test-creator/components/test-creator-form/test-creator-form.component';
import { UserTestsService } from '@test-creator/services/user-tests/user-tests.service';
import { Answer } from '@test-creator/types/answer';
import { QuestionsTypes } from '@test-creator/types/question';
import { Test } from '@test-creator/types/test';
import { debounceTime, map } from 'rxjs';
import { TestCreatorPageStore } from './test-creator-page.store';

/**
 * Number of milliseconds to debounce pending tasks signal in order to prevent the unnecessary showing of the loading indicator.
 */
const QUICK_ASYNC_TASKS_DEBOUNCE_TIME = 40 as const;

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
    AnswerWrapperComponent,
    TestCreatorFormComponent,
    LoadingIndicatorComponent,
    MatProgressSpinnerModule,
    NoDataInfoComponent,
  ],
  templateUrl: './test-creator-page.component.html',
  styleUrls: ['./test-creator-page.component.scss'],
  providers: [TestCreatorPageStore],
})
export class TestCreatorPageComponent implements HasPendingTasks, OnDestroy {
  private readonly testsService = inject(UserTestsService);
  private readonly store = inject(TestCreatorPageStore);
  private readonly route = inject(ActivatedRoute);
  private readonly pendingIndicatorService = inject(PendingIndicatorService);

  readonly test = this.store.test;
  readonly questions = this.store.questions;
  readonly questionsMetadata = this.store.questionsMetadata;
  readonly answers = this.store.answers;
  readonly isLoading = this.store.isLoading;
  readonly isPending = toSignal(
    toObservable(this.store.isPending).pipe(
      debounceTime(QUICK_ASYNC_TASKS_DEBOUNCE_TIME)
    )
  );

  constructor() {
    this.pendingIndicatorService.connectStateChanges({
      onPendingChange$: this.store.pendingState$,
    });

    this.store.loadTestData(
      this.route.params.pipe(map((params) => params['id']))
    );
  }

  ngOnDestroy(): void {
    this.pendingIndicatorService.disconnectStateChanges();
  }

  hasPendingTasks() {
    return this.isPending() ?? false;
  }

  getNewQuestionPosition(questions: Question[]) {
    return (questions.at(-1)?.position ?? 0) + 1;
  }

  getNewAnswerPosition(question: Question) {
    return (this.getAnswers(question).at(-1)?.position ?? 0) + 1;
  }

  getAnswers(question: Question) {
    return this.answers().get(question.id) ?? [];
  }

  handleUpdateTest(newTest: Test) {
    this.store.updateTest(newTest);
    this.store.saveTest(newTest);
  }

  handleUpdateAnswer(questionId: string, answer: Answer) {
    const payload = { questionId, answer };

    this.store.updateAnswer(payload);
    this.store.saveAnswerOnDb(payload);
  }

  handleAddAnswer(question: Question) {
    const answer: Answer = {
      content: 'Nowa odpowiedź',
      id: this.testsService.generateId(),
      position: this.getNewAnswerPosition(question),
    };
    const payload = { questionId: question.id, answer };

    this.store.addAnswer(payload);
    this.store.saveAnswerOnDb(payload);
  }

  handleDeleteAnswer(questionId: string, answerId: string) {
    const payload = { questionId, answerId };

    this.store.deleteAnswer(payload);
    this.store.deleteAnswerFromDb(payload);
  }

  handleAnswersPositionsSwap(
    question: Question,
    $event: CdkDragDrop<Answer[], Answer[], Answer>
  ) {
    const prevIndex = $event.previousIndex;
    const currentIndex = $event.currentIndex;
    const answers = this.getAnswers(question);
    const answer1 = answers[prevIndex];
    const answer2 = answers[currentIndex];
    const swap = { from: answer1, to: answer2, questionId: question.id };

    this.store.swapAnswersOnDb(swap);
    this.store.swapAnswers(swap);
  }

  handleUpdateQuestion(updatedQuestion: Question) {
    this.store.updateQuestion(updatedQuestion);
    this.store.saveQuestion(updatedQuestion);
  }

  handleAddQuestion(type: QuestionsTypes, position: number) {
    const newQuestion: Question = new Question({
      id: this.testsService.generateId(),
      type,
      content: 'Nowe pytanie',
      position,
    });

    this.store.addQuestion(newQuestion);
    this.store.saveQuestion(newQuestion);
  }

  handleDeleteQuestion(question: Question) {
    this.store.deleteQuestion(question);
    this.store.deleteQuestionFromDb(question);
  }

  handleQuestionsPositionsSwap(
    $event: CdkDragDrop<Question[], Question[], Question>
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
}
