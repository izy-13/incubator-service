import { Module } from '@nestjs/common';
import {
  AuthPasswordRecoveryController,
  AuthRegistrationController,
  AuthSessionController,
} from './auth.controllers';
import { UsersModule } from '../user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthEntity, AuthSchema } from './schemas/auth.schema';
import { AuthQueryRepository, AuthRepository } from './repositories';
import {
  CodeAuthExistsConstraint,
  RegisterAuthValidatorConstraint,
  ResendAuthValidatorConstraint,
} from './decorators';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { AuthUseCases } from './use-cases';
import { DeviceDeletedListener } from './listeners';

@Module({
  controllers: [AuthSessionController, AuthRegistrationController, AuthPasswordRecoveryController],
  exports: [AuthRepository, RefreshTokenGuard, ...AuthUseCases],
  imports: [
    MongooseModule.forFeature([{ name: AuthEntity.name, schema: AuthSchema }]),
    JwtModule.register({}),
    UsersModule,
  ],
  providers: [
    ...AuthUseCases,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    RefreshTokenGuard,
    AuthQueryRepository,
    AuthRepository,
    CodeAuthExistsConstraint,
    RegisterAuthValidatorConstraint,
    ResendAuthValidatorConstraint,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    DeviceDeletedListener,
  ],
})
export class AuthModule {}
