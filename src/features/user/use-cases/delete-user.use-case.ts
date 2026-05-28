import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly repository: UsersRepository) {}

  execute(id: string) {
    return this.repository.deleteUser(id);
  }
}
