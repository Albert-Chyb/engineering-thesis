export interface Answer {
  id: string;
  content: string;
  position: number;
}

export type RawAnswer = Omit<Answer, 'id'>;
