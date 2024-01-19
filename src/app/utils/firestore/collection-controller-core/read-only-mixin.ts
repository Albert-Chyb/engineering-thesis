import { DocumentData } from '@angular/fire/firestore';
import { CollectionControllerMixinsBase } from './collection-controller-base';
import { mixinList } from './list-mixin';
import { mixinRead } from './read-mixin';

export function mixinReadOnly<TData extends DocumentData>() {
  return function <TBase extends CollectionControllerMixinsBase<TData>>(
    Base: TBase,
  ) {
    return mixinRead<TData>()(mixinList<TData>()(Base));
  };
}
