import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto';
import { UserEntity } from '../entities/user.entity';
import { UsersQueryRepository } from './users.query-repository';
import { generateBcryptHash } from '../../../coreUtils';
import { genSalt } from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly queryRepository: UsersQueryRepository,
  ) {}

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const { email, login, password } = user;
    const passwordSalt = await genSalt(10);
    const { passwordHash } = await generateBcryptHash(password, passwordSalt);

    const newUser = await this.userModel.create({ email, login, passwordSalt, passwordHash });

    if (newUser._id) {
      return this.queryRepository.findUserById(newUser._id.toJSON());
    } else {
      throw new Error('User was not created');
    }
  }

  async deleteUser(id: string) {
    const result = await this.userModel.findByIdAndDelete({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async deleteAllUsers() {
    return this.userModel.deleteMany({}).exec();
  }
}
