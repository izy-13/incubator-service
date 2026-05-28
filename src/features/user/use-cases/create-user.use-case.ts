import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto';
import { UsersRepository } from '../repositories';
import { UserViewModelType } from '../viewModel';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<UserViewModelType> {
    return await this.repository.createUser(createUserDto);
  }
}
