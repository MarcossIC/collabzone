import { Base } from '@/common/domain/models/base.domain';
import { Credentials } from './credentials.domain';
import { AuthProvider } from './authProvider.domain';

export class User extends Base {
  email: string;
  name: string;
  lastname: string;
  confirmed: boolean;
  password?: string;
  credentials: Credentials;
  providers?: AuthProvider[];
}
