import { Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../repositories';
import { UserViewModelType } from '../viewModel';

@Injectable()
export class FindUserUseCase {
  constructor(private readonly queryRepository: UsersQueryRepository) {}

  execute(id: string): Promise<UserViewModelType> {
    return this.queryRepository.findUserOrFail({ _id: id });
  }
}
