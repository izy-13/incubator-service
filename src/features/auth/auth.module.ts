import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './schemas/auth.schema';
import { AuthQueryRepository, AuthRepository } from './repositories';
import { CodeAuthExistsConstraint, RegisterAuthValidatorConstraint, ResendAuthValidatorConstraint } from './decorators';

@Module({
  controllers: [AuthController],
  exports: [AuthRepository, AuthService],
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60m' },
      }),
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    AuthQueryRepository,
    AuthRepository,
    CodeAuthExistsConstraint,
    RegisterAuthValidatorConstraint,
    ResendAuthValidatorConstraint,
  ],
})
export class AuthModule {}
