import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { PromiseResult, ResultNotification, ResultStatus } from '../../../common';
import { UsersQueryRepository } from '../../user/repositories';
import { AuthQueryRepository, AuthRepository } from '../repositories';
import {
  AuthTokens,
  createAccessTokenPayload,
  createDeviceSecurityRecord,
  createRefreshTokenPayload,
} from './auth-token.helpers';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(forwardRef(() => UsersQueryRepository))
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authQueryRepository: AuthQueryRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshToken: string): PromiseResult<AuthTokens> {
    const authInfo = await this.authQueryRepository.findByRefreshToken(refreshToken);

    if (!authInfo) {
      return ResultNotification.error(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const user = await this.usersQueryRepository.findUserOrFail({ _id: authInfo.userId });

    if (!user) {
      return ResultNotification.error(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const deviceId = uuidv4();
    const userLoginOrEmail = user.login || user.email;
    const [accessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(createAccessTokenPayload(user.id, userLoginOrEmail), {
        secret: process.env.JWT_SECRET,
        expiresIn: '10s',
      }),
      this.jwtService.signAsync(createRefreshTokenPayload(user.id, userLoginOrEmail, deviceId), {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '20s',
      }),
    ]);

    const deviceSecurityRecord = createDeviceSecurityRecord(deviceId);
    console.log(accessToken, newRefreshToken, deviceSecurityRecord);

    await this.authRepository.saveRefreshTokenByUserId(user.id, newRefreshToken);

    return ResultNotification.success({ accessToken, refreshToken: newRefreshToken });
  }
}
