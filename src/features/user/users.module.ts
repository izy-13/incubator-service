import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UniqueValidator } from '../../common';
import { UserEntity, UserSchema } from './entities';
import { UsersController } from './api';
import { UsersService } from './application';
import { UsersQueryRepository, UsersRepository } from './repositories';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository, UsersQueryRepository],
  providers: [UsersService, UsersQueryRepository, UsersRepository, UniqueValidator],
})
export class UsersModule {}
