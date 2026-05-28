import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '../../../common';
import { FindAllUsersQueryDto } from '../dto';
import { UsersQueryRepository } from '../repositories';
import { UserViewModelType } from '../viewModel';

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly queryRepository: UsersQueryRepository) {}

  execute(queryParams: FindAllUsersQueryDto): Promise<PaginatedResponse<UserViewModelType>> {
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
}
