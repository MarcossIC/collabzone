import { UUID } from 'crypto';
import { User } from '../models/user.domain';

export abstract class ConfirmMailUsecase {
  abstract execute(id: UUID, version: number): Promise<User>;
}
