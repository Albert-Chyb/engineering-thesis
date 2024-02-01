import { Answer } from '../abstract/answer';

export class CheckableAnswer extends Answer<'single-choice' | 'multi-choice'> {
  constructor(
    public override readonly id: string,
    public override content: string,
    public isChecked: boolean,
  ) {
    super(id, content);
  }

  override copy() {
    return new CheckableAnswer(this.id, this.content, this.isChecked);
  }
}
