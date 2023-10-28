/** Shape of an object that is returned from the service. */
export interface Test {
  id: string;
  name: string;
}

/** Shape of an object that is stored in the database */
export type RawTest = Omit<Test, 'id'>;
