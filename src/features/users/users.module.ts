import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BasicAuthMiddleware } from '../../middlewares';
import { UsersQueryRepository, UsersRepository } from './repositories';
import { routesConstants } from '../../coreUtils';
import { UniqueValidator } from '../../decorators';
import { AuthModule } from '../auth/auth.module';

const { USERS } = routesConstants;

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  exports: [UsersQueryRepository, UsersRepository, UsersService],
  providers: [UsersService, UsersQueryRepository, UsersRepository, UniqueValidator],
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
