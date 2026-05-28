import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RegistrationAuthDto } from '../dto';
import { PromiseResult, ResultNotification } from '../../../common';
import { UsersRepository } from '../../user/repositories';
import { AuthRepository } from '../repositories';
import { emailManager } from '../../../infrastructure';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(registrationDto: RegistrationAuthDto): PromiseResult<string> {
    const user = await this.usersRepository.createUser(registrationDto);
    const code = await this.authRepository.createAuthInfoForUser(user.id);

    emailManager
      .sendConfirmationEmail(user.email, 'Confirm registration', code)
      .catch((e) => console.error(e));

    return ResultNotification.success(code);
  }
}
