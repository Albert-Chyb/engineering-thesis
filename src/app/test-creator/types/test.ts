/** Shape of the object that is stored in the database. */
export interface TestReadPayload {
  name: string;
}

/** Shape of an object that is required to create a new test in the database. */
export interface TestCreatePayload {
  name: string;
}

/** Shape of an object that is returned from the service. */
export interface Test {
  id: string;
  name: string;
}
