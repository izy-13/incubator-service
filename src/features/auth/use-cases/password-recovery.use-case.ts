import { Injectable } from '@nestjs/common';
import { PasswordRecoveryDto } from '../dto';
import { UsersQueryRepository } from '../../user/repositories';
import { ResultNotification } from '../../../common';
import { emailManager } from '../../../infrastructure';
import { AuthQueryRepository, AuthRepository } from '../repositories';

@Injectable()
export class PasswordRecoveryUseCase {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authRepository: AuthRepository,
    private readonly authQueryRepository: AuthQueryRepository,
  ) {}

  async execute(passwordRecoveryDto: PasswordRecoveryDto) {
    const { email } = passwordRecoveryDto;
    const user = await this.usersQueryRepository.findUserWithoutException({ email });

    if (!user) {
      return ResultNotification.success();
    }

    const recoveryCode = await this.authRepository.createRegistrationCode(user.id);
    await emailManager.sendPasswordRecoveryEmail(email, 'Password recovery', recoveryCode);
    return ResultNotification.success();
  }
}
