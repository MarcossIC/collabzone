import { Base } from '@/common/domain/models/base.domain';

export class UserCreation extends Base {
  email: string;
  name: string;
  lastname: string;
  password?: string;
}
