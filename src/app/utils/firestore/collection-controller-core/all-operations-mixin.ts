import { DocumentData } from '@angular/fire/firestore';
import { CollectionControllerMixinsBase } from './collection-controller-base';
import { mixinReadOnly } from './read-only-mixin';
import { mixinWrite } from './write-mixin';

export function mixinAllOperations<TData extends DocumentData>() {
  return function <TBase extends CollectionControllerMixinsBase<TData>>(
    Base: TBase,
  ) {
    return mixinWrite<TData>()(mixinReadOnly<TData>()(Base));
  };
}
