import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UniqueValidator } from '../../common';
import { UserEntity, UserSchema } from './entities';
import { UsersCommandController } from './users-command.controller';
import { UsersQueryController } from './users-query.controller';
import { UsersQueryRepository, UsersRepository } from './repositories';
import { UsersUseCases } from './use-cases';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
  controllers: [UsersQueryController, UsersCommandController],
  exports: [...UsersUseCases, UsersRepository, UsersQueryRepository],
  providers: [...UsersUseCases, UsersQueryRepository, UsersRepository, UniqueValidator],
})
export class UsersModule {}
