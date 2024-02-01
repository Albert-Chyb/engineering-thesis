import { Answer } from '../abstract/answer';

export class TextAnswer extends Answer<'text-answer'> {
  override copy(): TextAnswer {
    const copy = new TextAnswer(this.id, this.content);

    return copy;
  }
}
