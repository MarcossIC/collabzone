import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AccessTokenPayload } from '../../domain/models/jwtOptions.model';
import { IDENTITY_ERRORS } from '../../domain/constants/messages';

@Injectable()
export class ValidateAccessToken extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          const token = request?.cookies?.['access_token'];
          if (!token) {
            throw new UnauthorizedException(IDENTITY_ERRORS.USER_TOKEN_NOT_FOUND);
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.access.secret'),
    });
  }

  async validate(payload: AccessTokenPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
