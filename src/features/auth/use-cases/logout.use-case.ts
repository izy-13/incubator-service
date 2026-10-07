import { Injectable } from '@nestjs/common';
import {
  PromiseResult,
  ResultNotification,
  ResultStatus,
  UserLoggedOutEvent,
} from '../../../common';
import { AuthRepository } from '../repositories';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(refreshToken: string, deviceId: string): PromiseResult<boolean> {
    const result = await this.authRepository.clearRefreshToken(refreshToken);

    if (!result) {
      return ResultNotification.error(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    this.eventEmitter.emit('user.logged-out', new UserLoggedOutEvent(deviceId));

    return ResultNotification.success(true);
  }
}
