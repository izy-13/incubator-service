import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfirmCodeDto, CreateAuthDto, RegistrationAuthDto, ResendEmailDto } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { MeViewModelType } from '../api';
import { PromiseResult, ResultStatus } from '../../../types';
import { UsersQueryRepository, UsersRepository } from '../repositories';
import { emailManager, errorResult, successResult } from '../../../coreUtils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(userId: string, loginOrEmail: string, metadata?: object) {
    const deviceId = uuidv4();
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, loginOrEmail }, { secret: process.env.JWT_SECRET, expiresIn: '10s' }),
      this.jwtService.signAsync(
        { sub: userId, loginOrEmail, deviceId },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20s' },
      ),
    ]);
    const deviceSecurityRecord = { deviceId, lastActiveDate: new Date().toISOString(), ...metadata };
    console.log(accessToken, refreshToken, deviceSecurityRecord);
    await this.usersRepository.updateAuthInfo({ _id: userId }, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }

  async create(createAuthDto: CreateAuthDto, metadata: object): Promise<{ accessToken: string; refreshToken: string }> {
    const { loginOrEmail, password } = createAuthDto;
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.getTokens(user.id, user.login || user.email, metadata);
  }

  async findMe(id: string): Promise<MeViewModelType> {
    const user = await this.usersQueryRepository.findUser({ _id: id });

    return { email: user.email, login: user.login, userId: user.id };
  }

  async confirmCode(confirmCodeDto: ConfirmCodeDto): PromiseResult<boolean> {
    const { code } = confirmCodeDto;
    const result = await this.usersRepository.updateAuthByConfirmCode(code);

    if (!result) {
      return errorResult(ResultStatus.FORBIDDEN_ERROR, 'Something went wrong');
    }

    return successResult(ResultStatus.SUCCESS, result);
  }

  async registration(registrationDto: RegistrationAuthDto): PromiseResult<string> {
    const user = await this.usersRepository.createUser(registrationDto);
    const authInfo = await this.usersQueryRepository.findAuthInfo({ _id: user?.id });

    if (!authInfo) {
      return errorResult(ResultStatus.FORBIDDEN_ERROR, 'Something went wrong');
    }

    emailManager
      .sendConfirmationEmail(user.email, 'Confirm registration', authInfo.code)
      .catch((e) => console.error(e));
    return successResult(ResultStatus.SUCCESS, authInfo.code);
  }

  async resendEmail(resendEmailDto: ResendEmailDto): PromiseResult<string> {
    const { email } = resendEmailDto;
    // TODO not using queryRepository inside command service
    const authInfo = await this.usersQueryRepository.findAuthInfo({ email: email });
    // const authInfo = await this.usersQueryRepository.findAuthInfo({ userId: user?.id });

    if (!authInfo) {
      return errorResult(ResultStatus.FORBIDDEN_ERROR, 'Something went wrong');
    }

    const code = await this.usersRepository.resendConfirmCode(user.id, authInfo);
    // Promise.

    await emailManager.sendConfirmationEmail(email, 'Confirm registration', code);
    return successResult(ResultStatus.SUCCESS, code);
  }

  async refreshToken(refreshToken: string): PromiseResult<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersQueryRepository.findUserWithoutException({
      'authInfo.refreshToken': refreshToken,
    });

    if (!user) {
      return errorResult(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const result = await this.getTokens(user.id, user.login || user.email);
    await this.usersRepository.updateAuthInfo({ _id: user.id }, { refreshToken: result.refreshToken });
    return successResult(ResultStatus.SUCCESS, result);
  }

  async logout(refreshToken: string): PromiseResult<boolean> {
    const result = await this.usersRepository.updateAuthInfo(
      { 'authInfo.refreshToken': refreshToken },
      { refreshToken: '' },
    );

    if (!result) {
      return errorResult(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    return successResult(ResultStatus.SUCCESS, true);
  }
}
