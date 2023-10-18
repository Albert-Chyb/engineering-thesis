export abstract class LocalController<TObj> {
  abstract push(obj: TObj): void;

  abstract findIndex(predicate: (obj: TObj) => boolean): number;

  abstract insert(obj: TObj, index: number): void;

  abstract removeAt(index: number): void;

  abstract at(index: number): TObj;

  swap(index1: number, index2: number): void {
    const itemAtIndex1 = this.at(index1);

    this.insert(this.at(index2), index1);
    this.insert(itemAtIndex1, index2);
  }
}
