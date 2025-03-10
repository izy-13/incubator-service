import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { UsersQueryRepository, UsersRepository } from './repositories';
import { FindAllUsersQueryDto } from './dto/find-all-users-query.dto';
import { PaginatedResponse } from '../../types';
import { AuthRepository } from '../auth/repositories';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthRepository))
    private readonly authRepository: AuthRepository,
    private readonly repository: UsersRepository,
    private readonly queryRepository: UsersQueryRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.repository.createUser(createUserDto);

    if (user) {
      await this.authRepository.registerUser(user.id, true);
    }

    return user;
  }

  findAll(queryParams: FindAllUsersQueryDto): Promise<PaginatedResponse<UserEntity>> {
    const defaultParams = new FindAllUsersQueryDto();
    const {
      pageNumber = defaultParams.pageNumber,
      sortDirection = defaultParams.sortDirection,
      sortBy = defaultParams.sortBy,
      searchLoginTerm,
      searchEmailTerm,
      pageSize = defaultParams.pageSize,
    } = queryParams;

    return this.queryRepository.findAllUsers({
      pageSize,
      sortDirection,
      pageNumber,
      sortBy,
      searchLoginTerm,
      searchEmailTerm,
    });
  }

  findOne(id: string): Promise<UserEntity> {
    return this.queryRepository.findUser({ _id: id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.repository.deleteUser(id);
  }

  clearAll() {
    return this.repository.deleteAllUsers();
  }
}
