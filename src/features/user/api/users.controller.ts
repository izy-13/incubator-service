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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../application';
import { CreateUserDto, FindAllUsersQueryDto, UpdateUserDto } from '../dto';
import {
  BasicAuthGuard,
  ObjectIdValidationPipe,
  PaginatedResponse,
  PublicApi,
  ResultNotification,
  routesConstants,
} from '../../../common';
import { UserViewModelType } from '../api';

const { USERS } = routesConstants;

@Controller(USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<UserViewModelType> {
    return this.usersService.create(createUserDto);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @Get()
  findAll(
    @Query() queryParams: FindAllUsersQueryDto,
  ): Promise<PaginatedResponse<UserViewModelType>> {
    return this.usersService.findAll(queryParams);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
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
