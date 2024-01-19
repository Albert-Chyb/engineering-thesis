import { DocumentData } from '@angular/fire/firestore';
import { CollectionControllerMixinsBase } from './collection-controller-base';
import { mixinCreate } from './create-mixin';
import { mixinDelete } from './delete-mixin';
import { mixinUpdate } from './update-mixin';

export function mixinWrite<TData extends DocumentData>() {
  return function <TBase extends CollectionControllerMixinsBase<TData>>(
    Base: TBase,
  ) {
    return mixinCreate<TData>()(
      mixinUpdate<TData>()(mixinDelete<TData>()(Base)),
    );
  };
}
