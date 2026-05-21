import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../entities';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../dto';
import { UserViewModelType } from '../../api';
import { UsersQueryRepository } from '../query';
import { generateBcryptHash } from '../../../../common';
import { genSalt } from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
    private readonly queryRepository: UsersQueryRepository,
  ) {}

  async createUser(user: CreateUserDto): Promise<UserViewModelType> {
    const { email, login, password } = user;
    const passwordSalt = await genSalt(10);
    const { passwordHash } = await generateBcryptHash(password, passwordSalt);

    const newUser = await this.userModel.create({ email, login, passwordSalt, passwordHash });

    if (newUser._id) {
      return this.queryRepository.findUserOrFail({ _id: newUser._id.toJSON() });
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

  async updateUser(id: string, data: Partial<UserEntity>) {
    return await this.userModel.findOneAndUpdate({ _id: id }, data).exec();
  }
}
