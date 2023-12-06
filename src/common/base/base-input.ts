import { OnlyProps } from '../data/generics/object.generics';

export class BaseInput<This extends BaseInput<any>> {
  constructor(data: Partial<OnlyProps<This>> = {}) {
    Object.assign(this, data);
  }

}
