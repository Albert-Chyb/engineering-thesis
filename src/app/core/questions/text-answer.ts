import { OpenEndedQuestion } from '../abstract/open-ended-question';

export class TextQuestion extends OpenEndedQuestion<'text-answer'> {
  override generateAnswer() {
    return this.getAnswer()?.content || null;
  }
}
