import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';

@Injectable()
export class ClearUsersUseCase {
  constructor(private readonly repository: UsersRepository) {}

  execute() {
    return this.repository.deleteAllUsers();
  }
}
