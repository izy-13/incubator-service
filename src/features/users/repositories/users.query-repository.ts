import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { FilterQuery, Model } from 'mongoose';
import { UserEntity } from '../entities/user.entity';
import { FindAllUsersQueryDto } from '../dto/find-all-users-query.dto';
import { PaginatedResponse } from '../../../types';
import { formatPaginatedResponse, generateBcryptHash } from '../../../coreUtils';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findAllUsers(queryParams: FindAllUsersQueryDto): Promise<PaginatedResponse<UserEntity>> {
    const { searchEmailTerm, searchLoginTerm, sortBy, pageNumber, sortDirection, pageSize } = queryParams;

    const filterParams = [
      searchLoginTerm && { login: { $regex: searchLoginTerm, $options: 'i' } },
      searchEmailTerm && { email: { $regex: searchEmailTerm, $options: 'i' } },
    ].reduce((acc, item) => (item ? [...acc, item] : acc), []);
    const filter = filterParams.length ? { $or: filterParams } : {};
    const totalCount = await this.userModel.countDocuments(filter).exec();

    const users = await this.userModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1, _id: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const items: UserEntity[] = users.map(({ _id, email, login, createdAt }) => ({
      id: _id.toJSON(),
      email,
      login,
      createdAt: new Date(createdAt || '').toISOString(),
    }));

    return formatPaginatedResponse<UserEntity>({ page: pageNumber, items, pageSize, totalCount });
  }

  async findUserWithoutException(filter: FilterQuery<User>): Promise<UserEntity | null> {
    const user = await this.userModel.findOne(filter).exec();

    if (!user) {
      return null;
    }

    const { _id, email, login, createdAt } = user;

    return { id: _id.toJSON(), email, login, createdAt: new Date(createdAt || '').toISOString() };
  }

  async findUser(filter: FilterQuery<User>): Promise<UserEntity> {
    const user = await this.userModel.findOne(filter).exec();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const { _id, email, login, createdAt } = user;

    return { id: _id.toJSON(), email, login, createdAt: new Date(createdAt || '').toISOString() };
  }

  async findUserByLoginOrEmail(loginOrEmail: string, password: string): Promise<UserEntity> {
    const user = await this.userModel.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] }).exec();

    if (!user) {
      throw new UnauthorizedException('login is wrong');
    }

    const { passwordHash } = await generateBcryptHash(password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) {
      throw new UnauthorizedException('password is wrong');
    }

    const { _id, email, login, createdAt } = user;

    return { id: _id.toJSON(), email, login, createdAt: new Date(createdAt || '').toISOString() };
  }
}
