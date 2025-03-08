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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { routesConstants, transformValidationFactory } from '../../coreUtils';
import { UserEntity } from './entities/user.entity';
import { PaginatedResponse } from '../../types';
import { ObjectIdValidationPipe } from '../../pipes';
import { FindAllUsersQueryDto } from './dto/find-all-users-query.dto';
import { PublicApi } from '../../decorators';

const { USERS } = routesConstants;

@Controller(USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @PublicApi()
  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @PublicApi()
  @Get()
  findAll(@Query() queryParams: FindAllUsersQueryDto): Promise<PaginatedResponse<UserEntity>> {
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
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @PublicApi()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
