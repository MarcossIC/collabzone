import { compare } from 'bcrypt';
import { SigninUsecase } from '../../domain/ports/signin.port';
import { UserRepository } from '../../domain/ports/user.repository';
import { IDENTITY_ERRORS } from '../../domain/constants/messages';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SigninUsecaseAdapter extends SigninUsecase {
  constructor(private readonly repository: UserRepository) {
    super();
  }

  public async execute(params) {
    const { email, password } = params;
    const user = await this.repository.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException(IDENTITY_ERRORS.USER_INVALID_CREDENTIALS);
    }

    if (!(await compare(password, user.password))) {
      await this.repository.checkLastPassword(user.credentials, password);
    }

    return user;
  }
}
