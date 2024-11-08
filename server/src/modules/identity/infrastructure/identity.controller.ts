import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { IdentityService } from '../domain/ports/identity.service';
import { Origin } from '@/common/infrastructure/decorators/orign.decorator';
import * as Fasty from 'fastify';
import { CredentialDto } from './dtos/credential.dto';
import { UserCreateDto } from './dtos/userCreate.dto';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isJWT } from 'class-validator';
import { Public } from '@/common/infrastructure/decorators/public.decorator';
import { ConfirmEmailDto } from './dtos/confirmationmail.dto';
import { isNull, isUndefined } from '@/configuration/utils/validations';

@Controller('v1/identity')
export class IdentityController {
  private readonly refreshTime: number;
  private readonly accessTime: number;
  private readonly testing: boolean;
  constructor(
    private readonly service: IdentityService,
    private readonly configService: ConfigService,
  ) {
    this.refreshTime = this.configService.get<number>('jwt.refresh.time');
    this.accessTime = this.configService.get<number>('jwt.access.time');
    this.testing = this.configService.get<boolean>('testing');
  }

  @Public()
  @Post('/signup')
  public async createUser(
    @Origin() origin: string | undefined,
    @Body() user: UserCreateDto,
  ) {
    const { email, password, name, lastname } = user;
    return await this.service.signup(email, password, name, lastname, origin);
  }

  @Public()
  @Post('/signin')
  public async signin(
    @Res() res: Fasty.FastifyReply,
    @Origin() origin: string | undefined,
    @Body() user: CredentialDto,
  ): Promise<void> {
    const { email, password } = user;
    const result = await this.service.signin(email, password, origin);

    this.saveRefreshCookie(
      res,
      result.data.refreshToken,
      result.data.accessToken,
    )
      .status(result.statusCode)
      .send(result.data.user);
  }

  @Public()
  @Post('/refresh')
  public async refreshAccess(
    @Req() req: Fasty.FastifyRequest,
    @Res() res: Fasty.FastifyReply,
  ): Promise<void> {
    const token = this.refreshTokenFromReq(req);
    console.log("Token, ", token)
    const result = await this.service.refreshTokenAccess(
      token,
      req.headers.origin,
    );
    this.saveRefreshCookie(
      res,
      result.data.refreshToken,
      result.data.accessToken,
    )
      .status(result.statusCode)
      .send(result.data.user);
  }

  @Post('/logout')
  public async logout(
    @Req() req: Fasty.FastifyRequest,
    @Res() res: Fasty.FastifyReply,
  ): Promise<void> {
    const token = this.refreshTokenFromReq(req);
    const result = await this.service.logout(token);
    res
      .clearCookie('refresh_token', { path: '/' })
      .clearCookie('access_token', { path: '/' })
      .header('Content-Type', 'application/json')
      .status(result.statusCode)
      .send(result);
  }

  @Public()
  @Post('/confirm-email')
  public async confirmEmail(
    @Origin() origin: string | undefined,
    @Body() confirmEmailDto: ConfirmEmailDto,
    @Res() res: Fasty.FastifyReply,
  ): Promise<void> {
    const result = await this.service.confirmEmail(confirmEmailDto.confirmationToken, origin);

    this.saveRefreshCookie(
      res,
      result.data.refreshToken,
      result.data.accessToken,
    )
      .status(result.statusCode)
      .send(result.data.user);
  }

  private refreshTokenFromReq(req: Fasty.FastifyRequest): string {
    const token: string | undefined = req.cookies['refresh_token'];
    if (isUndefined(token) || isNull(token)) {
      throw new UnauthorizedException();
    }

    const { valid, value } = req.unsignCookie(token);

    if (!valid) {
      throw new UnauthorizedException();
    }

    return value;
  }

  private saveRefreshCookie(
    res: Fasty.FastifyReply,
    refreshToken: string,
    accessToken: string,
  ): Fasty.FastifyReply {
    const now = new Date().getTime();
    return res
      .setCookie('refresh_token', refreshToken, {
        secure: !this.testing,
        httpOnly: true,
        signed: true,
        path: '/',
        expires: new Date(now + this.refreshTime),
        maxAge: now + this.refreshTime,
        sameSite: "lax",
      })
      .setCookie('access_token', accessToken, {
        secure: !this.testing,
        httpOnly: true,
        signed: true,
        path: '/',
        expires: new Date(now + this.accessTime),
        maxAge: now + this.accessTime,
        sameSite: "lax"
      })
      .header('Content-Type', 'application/json');
  }
}
