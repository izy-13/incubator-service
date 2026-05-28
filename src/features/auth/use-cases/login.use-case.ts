import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { CreateAuthDto } from '../dto';
import { UsersQueryRepository } from '../../user/repositories';
import { AuthRepository } from '../repositories';
import {
  createAccessTokenPayload,
  createDeviceSecurityRecord,
  createRefreshTokenPayload,
} from './auth-token.helpers';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(forwardRef(() => UsersQueryRepository))
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(createAuthDto: CreateAuthDto, metadata: object) {
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
        expiresIn: '10s',
      }),
      this.jwtService.signAsync(createRefreshTokenPayload(user.id, userLoginOrEmail, deviceId), {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '20s',
      }),
    ]);

    const deviceSecurityRecord = createDeviceSecurityRecord(deviceId, metadata);
    console.log(accessToken, refreshToken, deviceSecurityRecord);

    await this.authRepository.saveRefreshTokenByUserId(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
