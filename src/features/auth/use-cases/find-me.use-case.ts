import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MeEntity } from '../entity/me.entity';
import { UsersQueryRepository } from '../../user/repositories';

@Injectable()
export class FindMeUseCase {
  constructor(
    @Inject(forwardRef(() => UsersQueryRepository))
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(id: string): Promise<MeEntity> {
    const user = await this.usersQueryRepository.findUserOrFail({ _id: id });

    return { email: user.email, login: user.login, userId: user.id };
  }
}
