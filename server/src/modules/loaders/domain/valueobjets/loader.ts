import { Base } from "@/common/domain/types/base.domain";

export interface Loader<T extends Base, P = undefined> {
    obj: T;
    params: P;
  }