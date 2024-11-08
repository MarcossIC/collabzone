import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../domain/ports/user.repository';
import { ConfirmMailUsecase } from '../../domain/ports/confirmmail.port';
import { UUID } from 'crypto';
import { User } from '../../domain/models/user.domain';
import { IDENTITY_ERRORS } from '../../domain/constants/messages';

@Injectable()
export class ConfirmMailUsecaseAdapter extends ConfirmMailUsecase {
  constructor(private readonly repository: UserRepository) {
    super();
  }
  public async execute(id: UUID, version: number) {
    const user = await this.repository.findOneById(id);
    if (!user || user?.credentials?.version !== version) {
      throw new UnauthorizedException(IDENTITY_ERRORS.USER_INVALID_CREDENTIALS);
    }
    if (user.confirmed) {
      throw new UnauthorizedException(IDENTITY_ERRORS.USER_ALREADY_CONFIRMED);
    }

    user.confirmed = true;
    user.credentials.version++;
    user.credentials.updatedAt = new Date();

    const updatedUser = await this.repository.save(user);

    return updatedUser;
  }
}
