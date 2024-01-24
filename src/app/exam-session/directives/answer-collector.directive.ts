import { Directive, Signal, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ANSWER_COLLECTOR_FORM_REF_DI_TOKEN,
  ANSWER_COLLECTOR_QUESTION_DI_TOKEN,
} from '@exam-session/constants/answers-collectors-DI';
import { AnswerShape } from '@exam-session/types/answers-collectors';
import { QuestionsTypes } from 'functions/src/models/test';

@Directive({
  standalone: true,
})
export class AnswerCollectorDirective<TQuestionType extends QuestionsTypes> {
  readonly question = inject(ANSWER_COLLECTOR_QUESTION_DI_TOKEN);
  readonly formRef: Signal<FormControl<AnswerShape<TQuestionType>>> = inject(
    ANSWER_COLLECTOR_FORM_REF_DI_TOKEN,
  );
}
