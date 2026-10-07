import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RegistrationAuthDto } from '../dto';
import { PromiseResult, ResultNotification } from '../../../common';
import { UsersRepository } from '../../user/repositories';
import { AuthRepository } from '../repositories';
import { emailManager } from '../../../infrastructure';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(registrationDto: RegistrationAuthDto): PromiseResult<string> {
    const deviceId = uuidv4();

    const user = await this.usersRepository.createUser(registrationDto);
    const code = await this.authRepository.createAuthInfoForUser(user.id, deviceId);

    emailManager
      .sendConfirmationEmail(user.email, 'Confirm registration', code)
      .catch((e) => console.error(e));

    return ResultNotification.success(code);
  }
}
