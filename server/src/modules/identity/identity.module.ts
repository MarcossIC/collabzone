import { Module } from '@nestjs/common';
import { UserMySQLRepository } from './infrastructure/persistence/user.mysql.repository';
import { UserRepository } from './domain/ports/user.repository';
import { IdentityServiceAdapter } from './application/identity.service.adapter';
import { IdentityService } from './domain/ports/identity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './infrastructure/persistence/user.schema';
import { CommonModule } from '@/common/common.module';
import { SigninUsecaseAdapter } from './application/usecases/signin-usecase';
import { SigninUsecase } from './domain/ports/signin.port';
import { SignupUsecase } from './domain/ports/signup.port';
import { SignupUsecaseAdapter } from './application/usecases/signup.usecase';
import { PassportModule } from '@nestjs/passport';
import { CustomJwtService } from './domain/ports/jwt.service';
import { JwtServiceAdapter } from './infrastructure/adapter/jwt.service.adapter';
import { JwtModule } from '@nestjs/jwt';
import { ConfirmMailUsecase } from './domain/ports/confirmmail.port';
import { ConfirmMailUsecaseAdapter } from './application/usecases/confirmmail.usecase';
import { RefreshAccessUseCase } from './domain/ports/refreshaccess.port';
import { RefreshAccessUseCaseAdapter } from './application/usecases/refreshaccess.usecase';
import { IdentityController } from './infrastructure/identity.controller';
import { AuthProviderSchema } from './infrastructure/persistence/authproviders.schema';
import { UserCreatedListener } from './infrastructure/userCreated.event';
import { UserNotConfirmedListener } from './infrastructure/notConfirmed.event';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserSchema, AuthProviderSchema]),
    JwtModule.register({
      global: true,
      signOptions: { algorithm: 'HS256' },
    }),
    CommonModule,
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserMySQLRepository,
    },
    {
      provide: SigninUsecase,
      useClass: SigninUsecaseAdapter,
    },
    {
      provide: SignupUsecase,
      useClass: SignupUsecaseAdapter,
    },
    {
      provide: ConfirmMailUsecase,
      useClass: ConfirmMailUsecaseAdapter,
    },
    {
      provide: RefreshAccessUseCase,
      useClass: RefreshAccessUseCaseAdapter,
    },
    {
      provide: IdentityService,
      useClass: IdentityServiceAdapter,
    },
    {
      provide: CustomJwtService,
      useClass: JwtServiceAdapter,
    },
    UserCreatedListener,
    UserNotConfirmedListener,
  ],
  controllers: [IdentityController],
})
export class IdentityModule {}
