import { Injectable, inject } from '@angular/core';
import { ANSWERS_COLLECTORS_DI_TOKEN } from '@exam-session/constants/answers-collectors-DI';
import { AnswerCollectorConfig } from '@exam-session/types/answers-collectors';
import { QuestionsTypes } from 'functions/src/models/test';

@Injectable({
  providedIn: 'root',
})
export class AnswersCollectorsService {
  private readonly config = inject(ANSWERS_COLLECTORS_DI_TOKEN);

  get<TQuestionType extends QuestionsTypes>(
    questionType: TQuestionType,
  ): AnswerCollectorConfig<TQuestionType> {
    return this.config[questionType];
  }
}
