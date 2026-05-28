import { Injectable } from '@nestjs/common';
import { PromiseResult, ResultNotification, ResultStatus } from '../../../common';
import { AuthRepository } from '../repositories';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(refreshToken: string): PromiseResult<boolean> {
    const result = await this.authRepository.clearRefreshToken(refreshToken);

    if (!result) {
      return ResultNotification.error(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    return ResultNotification.success(true);
  }
}
