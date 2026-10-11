import { Injectable } from '@nestjs/common';
import { UsersQueryRepository, UsersRepository } from '../../user/repositories';
import { AuthQueryRepository, AuthRepository } from '../repositories';
import { NewPasswordDto } from '../dto';
import { generateBcryptHash, ResultNotification, ResultStatus } from '../../../common';
import { genSalt } from 'bcrypt';

@Injectable()
export class NewPasswordUseCase {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthRepository,
    private readonly authQueryRepository: AuthQueryRepository,
  ) {}

  async execute(passwordNewDto: NewPasswordDto) {
    const { recoveryCode, newPassword } = passwordNewDto;
    const authInfo = await this.authQueryRepository.findAuthInfo({ recoveryCode });
    if (!authInfo) {
      return ResultNotification.error(ResultStatus.BAD_REQUEST, '', [
        { field: 'recoveryCode', message: 'Recovery Code invalid' },
      ]);
    }
    const now = new Date();
    const recoveryCodeExpiredAt = authInfo?.recoveryCodeExpiredAt;

    if (!recoveryCodeExpiredAt || new Date(recoveryCodeExpiredAt) < now) {
      return ResultNotification.error(ResultStatus.BAD_REQUEST, 'Code has been expired');
    }

    const user = await this.usersQueryRepository.findUserWithoutException({
      _id: authInfo?.userId,
    });

    if (!user) {
      return ResultNotification.error(ResultStatus.BAD_REQUEST, 'Not found user');
    }

    const passwordSalt = await genSalt(10);
    const { passwordHash } = await generateBcryptHash(newPassword, passwordSalt);
    await this.usersRepository.updateUser(user.id, { passwordHash, passwordSalt });
    await this.authRepository.updateAuthInfo(
      { recoveryCode },
      { recoveryCodeExpiredAt: new Date().toISOString(), recoveryCode: '' },
    );
    return ResultNotification.success();
  }
}
