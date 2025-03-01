import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { UsersQueryRepository, UsersRepository } from './repositories';
import { FindAllUsersQueryDto } from './dto/find-all-users-query.dto';
import { PaginatedResponse } from '../../types';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly queryRepository: UsersQueryRepository,
  ) {}

  create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.repository.createUser(createUserDto);
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
    return this.queryRepository.findUserById(id);
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
