import { ClosedQuestion } from '../abstract/closed-question';

export class SingleChoiceQuestion extends ClosedQuestion<'single-choice'> {
  override generateAnswer() {
    const checkedAnswers = this.getAnswers().filter((a) => a.isChecked);

    if (checkedAnswers.length !== 1) {
      throw new Error(
        'A single choice question must contain exactly ONE checked answer',
      );
    }

    return checkedAnswers.at(0)!.id;
  }
}
