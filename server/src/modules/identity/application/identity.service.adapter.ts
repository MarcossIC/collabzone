import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Manager from 'cache-manager';
import { UUID } from 'crypto';

import { CommonService } from '@/common/domain/port/common.service';
import { CommonMapper } from '@/common/domain/utils/common.mapper';

import {
  IDENTITY_ERRORS,
  IDENTITY_SUCCESS,
} from '../domain/constants/messages';
import { TokenTypeEnum } from '../domain/enums/tokenTypes.enum';
import { AuthResult } from '../domain/models/authResult.model';
import {
  NotConfirmedEvent,
  UserCreatedEvent,
} from '../domain/models/events.model';
import { EmailPayload, RefreshToken } from '../domain/models/token.model';
import { User } from '../domain/models/user.domain';
import { UserSummary } from '../domain/models/userSummary.model';
import { ConfirmMailUsecase } from '../domain/ports/confirmmail.port';
import { IdentityService } from '../domain/ports/identity.service';
import { CustomJwtService } from '../domain/ports/jwt.service';
import { RefreshAccessUseCase } from '../domain/ports/refreshaccess.port';
import { SigninUsecase } from '../domain/ports/signin.port';
import { SignupUsecase } from '../domain/ports/signup.port';

@Injectable()
export class IdentityServiceAdapter extends IdentityService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Manager.Cache,
    private readonly jwt: CustomJwtService,
    private readonly eventEmitter: EventEmitter2,
    private readonly commonService: CommonService,
    private readonly signinUseCase: SigninUsecase,
    private readonly signupUseCase: SignupUsecase,
    private readonly refreshUsecase: RefreshAccessUseCase,
    private readonly confirmUsecase: ConfirmMailUsecase,
  ) {
    super();
  }
  private async generateAuthResult(
    user: User,
    domain?: string,
  ): Promise<AuthResult> {
    const [accessToken, refreshToken] = await this.jwt.generateAuthTokens(
      user,
      domain,
    );
    return { user: new UserSummary(user), accessToken, refreshToken };
  }

  public override async signup(email, password, name, lastname, domain) {
    const user = await this.signupUseCase.execute({
      email,
      password,
      name,
      lastname,
    });
    const confirmationToken = await this.jwt.generateToken(
      user,
      TokenTypeEnum.CONFIRMATION,
      domain,
    );
    this.eventEmitter.emitAsync(
      'user.created',
      new UserCreatedEvent(
        `${user.name} ${user.lastname}`,
        user.email,
        confirmationToken,
      ),
    );

    return CommonMapper.mapApiResponse<string>(
      201,
      IDENTITY_SUCCESS.USER_CREATED,
      confirmationToken,
    );
  }

  public override async confirmEmail(confirmationToken, domain) {
    const { id, version } = (await this.jwt.verifyToken(
      confirmationToken,
      TokenTypeEnum.CONFIRMATION,
    )) as EmailPayload;

    const user = await this.confirmUsecase.execute(id, version);

    // Crear respuesta de login
    const authResult = await this.generateAuthResult(user, domain);

    return CommonMapper.mapApiResponse(
      200,
      IDENTITY_SUCCESS.USER_LOGIN,
      authResult,
    );
  }

  public override async signin(email, password, domain) {
    const user = await this.signinUseCase.execute({ email, password });
    if (!user.confirmed) {
      const confirmationToken = await this.jwt.generateToken(
        user,
        TokenTypeEnum.CONFIRMATION,
        domain,
      );
      this.eventEmitter.emitAsync(
        'user.notconfirmed',
        new NotConfirmedEvent(
          `${user.name} ${user.lastname}`,
          user.email,
          confirmationToken,
        ),
      );
      throw new UnauthorizedException(IDENTITY_ERRORS.USER_UNCONFIRMED);
    }
    // Crear respuesta de login
    const authResult = await this.generateAuthResult(user, domain);

    return CommonMapper.mapApiResponse(
      200,
      IDENTITY_SUCCESS.USER_LOGIN,
      authResult,
    );
  }

  public override async refreshTokenAccess(refreshToken, domain) {
    // Validar el token
    const payload = (await this.jwt.verifyToken(
      refreshToken,
      TokenTypeEnum.REFRESH,
    )) as RefreshToken;
    // Validar que no se encuentre en blacklist
    await this.checkBlackList(payload.id, payload.tokenId);
    // Validar datos del usuario
    const user = await this.refreshUsecase.execute(payload.id, payload.sub);
    // Crear respuesta
    const authResult = await this.generateAuthResult(user, domain);

    return CommonMapper.mapApiResponse(
      200,
      IDENTITY_SUCCESS.USER_LOGIN,
      authResult,
    );
  }

  public override async logout(refreshToken: string) {
    // Validar el token
    const { id, tokenId, exp } = (await this.jwt.verifyToken(
      refreshToken,
      TokenTypeEnum.REFRESH,
    )) as RefreshToken;
    // Guardar en blacklist
    await this.saveInBlackList(id, tokenId, exp);
    return CommonMapper.mapApiResponse(
      200,
      IDENTITY_SUCCESS.USER_LOGOUT,
      undefined,
    );
  }

  private async saveInBlackList(
    userId: UUID,
    tokenId: string,
    exp: number,
  ): Promise<void> {
    const now = new Date().getTime();
    const ttl = (exp - now) * 1000;

    if (ttl > 0) {
      await this.commonService.throwInternalError(
        this.cacheManager.set(`blacklist:${userId}:${tokenId}`, now, ttl),
      );
    }
  }

  private async checkBlackList(userId: UUID, tokenId: string): Promise<void> {
    const time = await this.cacheManager.get<number>(
      `blacklist:${userId}:${tokenId}`,
    );

    if (!isNaN(time)) {
      throw new UnauthorizedException(IDENTITY_ERRORS.USER_TOKEN_INVALID);
    }
  }
}
