import { ClosedQuestion } from '../abstract/closed-question';

export class MultiChoiceQuestion extends ClosedQuestion<'multi-choice'> {
  override generateAnswer() {
    const checkedAnswers = this.getAnswers().filter((a) => a.isChecked);

    if (checkedAnswers.length === 0) {
      throw new Error(
        `A multiple choice question must have at least one checked answer`,
      );
    }

    return checkedAnswers.map((a) => a.id);
  }
}
