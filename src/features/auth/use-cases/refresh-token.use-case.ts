import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  PromiseResult,
  ResultNotification,
  ResultStatus,
  UserLoggedRefreshEvent,
} from '../../../common';
import { UsersQueryRepository } from '../../user/repositories';
import { AuthQueryRepository, AuthRepository } from '../repositories';
import {
  AuthTokens,
  createAccessTokenPayload,
  createDeviceSecurityRecord,
  createRefreshTokenPayload,
} from './auth-token.helpers';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(forwardRef(() => UsersQueryRepository))
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authQueryRepository: AuthQueryRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(refreshToken: string, deviceId: string): PromiseResult<AuthTokens> {
    const authInfo = await this.authQueryRepository.findByRefreshToken(refreshToken);

    if (!authInfo) {
      return ResultNotification.error(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const user = await this.usersQueryRepository.findUserOrFail({ _id: authInfo?.userId });

    if (!user) {
      return ResultNotification.error(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const userLoginOrEmail = user.login || user.email;
    const [accessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(createAccessTokenPayload(user.id, userLoginOrEmail), {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(createRefreshTokenPayload(user.id, userLoginOrEmail, deviceId), {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '60m',
      }),
    ]);

    const { lastActiveDate } = createDeviceSecurityRecord(deviceId);
    this.eventEmitter.emit(
      'user.logged-refresh',
      new UserLoggedRefreshEvent(lastActiveDate, deviceId),
    );

    await this.authRepository.saveRefreshToken(user.id, deviceId, newRefreshToken);

    return ResultNotification.success({ accessToken, refreshToken: newRefreshToken });
  }
}
