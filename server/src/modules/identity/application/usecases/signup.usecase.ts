import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { isEmpty } from 'class-validator';

import { ILoggerService } from '@/common/domain/port/logger.service';
import { UserRepository } from '@/modules/identity/domain/ports/user.repository';

import { IDENTITY_ERRORS } from '../../domain/constants/messages';
import { AuthProvidersEnum } from '../../domain/enums/authProvider.enum';
import { UserCreation } from '../../domain/models/usercreation.domain';
import { SignupUsecase } from '../../domain/ports/signup.port';

@Injectable()
export class SignupUsecaseAdapter extends SignupUsecase {
  constructor(
    private readonly repository: UserRepository,
    private readonly logger: ILoggerService,
  ) {
    super();
  }

  public override async execute(params: UserCreation) {
    const formattedEmail = params.email.toLowerCase();
    const isUnique = await this.repository.checkEmailUniqueness(formattedEmail);
    if (!isUnique) {
      throw new ConflictException(IDENTITY_ERRORS.USER_DUPLICATE);
    }
    const user = await this.repository.create(
      {
        ...params,
        email: formattedEmail,
        confirmed: false,
        password: isEmpty(params.password)
          ? 'UNSET'
          : await hash(params.password, 10),
        credentials: undefined,
      },
      AuthProvidersEnum.LOCAL,
    );

    await this.repository.createAuthProvider(AuthProvidersEnum.LOCAL, user.id);

    return user;
  }
}
