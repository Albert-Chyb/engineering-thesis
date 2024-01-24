import { MultiChoiceAnswerCollectorComponent } from '@exam-session/components/multi-choice-answer-collector/multi-choice-answer-collector.component';
import { SingleChoiceAnswerCollectorComponent } from '@exam-session/components/single-choice-answer-collector/single-choice-answer-collector.component';
import { TextAnswerCollectorComponent } from '@exam-session/components/text-answer-collector/text-answer-collector.component';
import { AnswersCollectorConfig } from '@exam-session/types/answers-collectors';

export const ANSWER_COLLECTORS_CONFIG: AnswersCollectorConfig = {
  'single-choice': {
    abstractInstruction: 'Wybierz jedną odpowiedź',
    CollectorComponent: SingleChoiceAnswerCollectorComponent
  },

  'multi-choice': {
    abstractInstruction: 'Wybierz wszystkie poprawne odpowiedzi',
    CollectorComponent: MultiChoiceAnswerCollectorComponent
  },

  'text-answer': {
    abstractInstruction: 'Wpisz odpowiedź',
    CollectorComponent: TextAnswerCollectorComponent
  },
};
