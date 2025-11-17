import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthEntity, UserEntity } from '../../entities';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from '../../dto';
import { UserViewModelType } from '../../api';
import { UsersQueryRepository } from '../query';
import { generateBcryptHash } from '../../../../coreUtils';
import { genSalt } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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
    const code = uuidv4();
    const newAuthInfo = {
      code,
      isConfirmed: true,
      createdAt: new Date().toISOString(),
      attempts: 0,
      refreshToken: '',
      expiresAt: '',
    };

    const newUser = await this.userModel.create({ email, login, passwordSalt, passwordHash, authInfo: newAuthInfo });

    if (newUser._id) {
      return this.queryRepository.findUser({ _id: newUser._id.toJSON() });
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

  async updateAuthByConfirmCode(code: string): Promise<boolean> {
    const result = await this.userModel
      .findOneAndUpdate(
        { 'authInfo.code': code },
        { $set: { 'authInfo.isConfirmed': true, 'authInfo.code': code } },
        { new: true },
      )
      .exec();
    return !!result;
  }

  async updateConfirmCode(userId: string, authInfo: AuthEntity): Promise<string> {
    const { isConfirmed, code } = authInfo;
    const codeProps = !isConfirmed ? uuidv4() : code;

    await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $set: { 'authInfo.code': codeProps },
          $inc: { 'authInfo.attempts': 1 },
        },
      )
      .exec();
    return codeProps;
  }

  async updateAuthInfo(filter: FilterQuery<AuthEntity>, authInfo: Partial<AuthEntity>) {
    const updateFields = Object.entries(authInfo).reduce(
      (acc, [key, value]) => {
        acc[`authInfo.${key}`] = value;
        return acc;
      },
      {} as Record<string, any>,
    );

    return await this.userModel.findOneAndUpdate(filter, { $set: updateFields }, { new: true }).exec();
  }
}
