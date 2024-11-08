import { AuthProvidersEnum } from '@/modules/identity/domain/enums/authProvider.enum';
import { User } from '../models/user.domain';
import { Email } from '../../../../common/domain/types/email.valueobject';
import { UUID } from 'crypto';
import { AuthProvider } from '../models/authProvider.domain';
import { Credentials } from '../models/credentials.domain';

export abstract class UserRepository {
  abstract create(user: User, provider: AuthProvidersEnum): Promise<User>;
  abstract save(user: User): Promise<User>;
  abstract findOrCreate(user: User, provider: AuthProvidersEnum): Promise<User>;
  abstract findOneById(userId: UUID): Promise<User>;
  abstract findOneByEmail(email: string): Promise<User>;
  abstract checkEmailUniqueness(email: string): Promise<boolean>;
  abstract updateName(userId: number, name: string): Promise<User>;
  abstract updateEmail(userId: number, email: Email): Promise<User>;
  //abstract throwUnauthorizedException(user: undefined | null | User): void;
  abstract createAuthProvider(
    provider: AuthProvidersEnum,
    userId: UUID,
  ): Promise<AuthProvider>;
  abstract checkLastPassword(
    credentials: Credentials,
    password: string,
  ): Promise<void>;
}