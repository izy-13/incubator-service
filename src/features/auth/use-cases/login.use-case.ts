import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { CreateAuthDto } from '../dto';
import { UsersQueryRepository } from '../../user/repositories';
import { AuthQueryRepository, AuthRepository } from '../repositories';
import {
  createAccessTokenPayload,
  createDeviceSecurityRecord,
  createRefreshTokenPayload,
} from './auth-token.helpers';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserLoggedInEvent } from '../../../common';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authRepository: AuthRepository,
    private readonly authQueryRepository: AuthQueryRepository,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    createAuthDto: CreateAuthDto,
    metadata: { ip?: string | string[]; title?: string },
  ) {
    const { loginOrEmail, password } = createAuthDto;
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const deviceId = uuidv4();
    const userLoginOrEmail = user.login || user.email;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(createAccessTokenPayload(user.id, userLoginOrEmail), {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(createRefreshTokenPayload(user.id, userLoginOrEmail, deviceId), {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '60m',
      }),
    ]);
    const deviceSecurityRecord = createDeviceSecurityRecord(deviceId, metadata);

    const userId = user.id;
    const ip = metadata?.ip || '';
    const title = metadata?.title || '';
    const lastActiveDate = deviceSecurityRecord.lastActiveDate;

    this.eventEmitter.emit(
      'user.logged-in',
      new UserLoggedInEvent(userId, deviceId, ip, title, lastActiveDate),
    );

    await this.authRepository.createAuthInfoForUserWithToken(user.id, refreshToken, deviceId);

    return {
      accessToken,
      refreshToken,
    };
  }
}
