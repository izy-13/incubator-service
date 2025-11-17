import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../application';
import { CreateUserDto, FindAllUsersQueryDto, UpdateUserDto } from '../dto';
import { routesConstants, transformValidationFactory } from '../../../coreUtils';
import { UserViewModelType } from '../api';
import { PaginatedResponse } from '../../../types';
import { ObjectIdValidationPipe } from '../../../pipes';
import { PublicApi } from '../../../decorators';

const { USERS } = routesConstants;

@Controller(USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @PublicApi()
  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<UserViewModelType> {
    return this.usersService.create(createUserDto);
  }

  @PublicApi()
  @Get()
  findAll(@Query() queryParams: FindAllUsersQueryDto): Promise<PaginatedResponse<UserViewModelType>> {
    return this.usersService.findAll(queryParams);
  }

  @PublicApi()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.usersService.remove(id);
  }

  @PublicApi()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserViewModelType> {
    return this.usersService.findOne(id);
  }

  @PublicApi()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
