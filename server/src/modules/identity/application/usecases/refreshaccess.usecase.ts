import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshAccessUseCase } from '../../domain/ports/refreshaccess.port';
import { UserRepository } from '../../domain/ports/user.repository';
import { IDENTITY_ERRORS } from '../../domain/constants/messages';
import { UUID } from 'crypto';

@Injectable()
export class RefreshAccessUseCaseAdapter extends RefreshAccessUseCase {
  constructor(private readonly repository: UserRepository) {
    super();
  }
  public override async execute(id: UUID, email: string) {
    const user = await this.repository.findOneByEmail(email);
    console.log('User by email, ', user);
    if (!user || !user?.confirmed) {
      throw new UnauthorizedException(IDENTITY_ERRORS.USER_INVALID_CREDENTIALS);
    }
    if (user.id !== id) {
      throw new UnauthorizedException(IDENTITY_ERRORS.USER_ID_MISMATCH);
    }
    return user;
  }
}
