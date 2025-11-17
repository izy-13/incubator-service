import { Injectable } from '@nestjs/common';
import { CreateUserDto, FindAllUsersQueryDto, UpdateUserDto } from '../dto';
import { UserViewModelType } from '../api';
import { UsersQueryRepository, UsersRepository } from '../repositories';
import { PaginatedResponse } from '../../../types';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly queryRepository: UsersQueryRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserViewModelType> {
    return await this.repository.createUser(createUserDto);

    // if (user) {
    //   await this.authRepository.registerUser(user.id, true);
    // }
  }

  findAll(queryParams: FindAllUsersQueryDto): Promise<PaginatedResponse<UserViewModelType>> {
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

  findOne(id: string): Promise<UserViewModelType> {
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
