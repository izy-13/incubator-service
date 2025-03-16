import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './schemas/auth.schema';
import { AuthQueryRepository, AuthRepository } from './repositories';
import { CodeAuthExistsConstraint, RegisterAuthValidatorConstraint, ResendAuthValidatorConstraint } from './decorators';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  exports: [AuthRepository, AuthService],
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.register({}),
    forwardRef(() => UsersModule),
  ],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    RefreshTokenGuard,
    AuthQueryRepository,
    AuthRepository,
    CodeAuthExistsConstraint,
    RegisterAuthValidatorConstraint,
    ResendAuthValidatorConstraint,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
