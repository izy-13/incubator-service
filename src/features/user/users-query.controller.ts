import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BasicAuthGuard, PaginatedResponse, PublicApi, routesConstants } from '../../common';
import { FindAllUsersQueryDto } from './dto';
import { UserViewModelType } from './viewModel';
import { FindAllUsersUseCase, FindUserUseCase } from './use-cases';

const { USERS } = routesConstants;

@Controller(USERS)
export class UsersQueryController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserUseCase: FindUserUseCase,
  ) {}

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @Get()
  findAll(
    @Query() queryParams: FindAllUsersQueryDto,
  ): Promise<PaginatedResponse<UserViewModelType>> {
    return this.findAllUsersUseCase.execute(queryParams);
  }

  @PublicApi()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserViewModelType> {
    return this.findUserUseCase.execute(id);
  }
}
