import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  BasicAuthGuard,
  ObjectIdValidationPipe,
  PublicApi,
  ResultNotification,
  routesConstants,
} from '../../common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserViewModelType } from './viewModel';
import { CreateUserUseCase, DeleteUserUseCase, UpdateUserUseCase } from './use-cases';

const { USERS } = routesConstants;

@Controller(USERS)
export class UsersCommandController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<UserViewModelType> {
    return this.createUserUseCase.execute(createUserDto);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.deleteUserUseCase.execute(id);
  }

  @PublicApi()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(+id, updateUserDto);
  }
}
