import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ResendEmailDto } from '../dto';
import { PromiseResult, ResultNotification, ResultStatus } from '../../../common';
import { UsersQueryRepository } from '../../user/repositories';
import { AuthQueryRepository, AuthRepository } from '../repositories';
import { emailManager } from '../../../infrastructure';

@Injectable()
export class ResendEmailUseCase {
  constructor(
    @Inject(forwardRef(() => UsersQueryRepository))
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authQueryRepository: AuthQueryRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(resendEmailDto: ResendEmailDto): PromiseResult<string> {
    const { email } = resendEmailDto;
    const user = await this.usersQueryRepository.findUserWithoutException({ email });
    const authInfo = user ? await this.authQueryRepository.findByUserId(user.id) : null;

    if (!authInfo || !user) {
      return ResultNotification.error(ResultStatus.FORBIDDEN_ERROR, 'Something went wrong');
    }

    const code = await this.authRepository.updateRegistrationCode(user.id, authInfo);

    await emailManager.sendConfirmationEmail(email, 'Confirm registration', code);
    return ResultNotification.success(code);
  }
}
