import { Base } from '@/common/domain/models/base.domain';

export interface Loader<T extends Base, P = undefined> {
  obj: T;
  params: P;
}
