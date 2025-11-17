import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UniqueValidator } from '../../decorators';
import { BasicAuthMiddleware } from '../../middlewares';
import { routesConstants } from '../../coreUtils';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { UserEntity, UserSchema } from './entities';
import { AccessTokenGuard, AuthController, RefreshTokenGuard, UsersController } from './api';
import { AuthService, UsersService } from './application';
import { UsersQueryRepository, UsersRepository } from './repositories';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { CodeAuthExistsConstraint, RegisterAuthValidatorConstraint, ResendAuthValidatorConstraint } from './decorators';

const { USERS } = routesConstants;

@Module({
  imports: [JwtModule.register({}), MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
  controllers: [UsersController, AuthController],
  exports: [UsersService],
  providers: [
    // UsersProviders
    UsersService,
    UsersQueryRepository,
    UsersRepository,
    // AuthProviders
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    RefreshTokenGuard,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    CodeAuthExistsConstraint,
    RegisterAuthValidatorConstraint,
    ResendAuthValidatorConstraint,
    // GeneralProviders
    UniqueValidator,
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BasicAuthMiddleware)
      .forRoutes(
        { path: USERS, method: RequestMethod.POST },
        { path: USERS, method: RequestMethod.GET },
        { path: `${USERS}/:id`, method: RequestMethod.DELETE },
      );
  }
}
