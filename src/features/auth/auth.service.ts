import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfirmCodeDto, CreateAuthDto, RegistrationAuthDto, ResendEmailDto } from './dto';
import { UsersQueryRepository, UsersRepository } from '../user/repositories';
import { JwtService } from '@nestjs/jwt';
import { MeEntity } from './entity/me.entity';
import { PromiseResult, ResultNotification, ResultStatus } from '../../common';
import { AuthQueryRepository, AuthRepository } from './repositories';
import { v4 as uuidv4 } from 'uuid';
import { emailManager } from '../../infrastructure';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersQueryRepository))
    private readonly usersQueryRepository: UsersQueryRepository,
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    private readonly repository: AuthRepository,
    private readonly queryRepository: AuthQueryRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(userId: string, loginOrEmail: string, metadata?: object) {
    const deviceId = uuidv4();
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, loginOrEmail },
        { secret: process.env.JWT_SECRET, expiresIn: '10s' },
      ),
      this.jwtService.signAsync(
        { sub: userId, loginOrEmail, deviceId },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20s' },
      ),
    ]);

    const deviceSecurityRecord = {
      deviceId,
      lastActiveDate: new Date().toISOString(),
      ...metadata,
    };
    console.log(accessToken, refreshToken, deviceSecurityRecord);

    await this.repository.updateAuthInfo({ userId }, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }

  async create(
    createAuthDto: CreateAuthDto,
    metadata: object,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { loginOrEmail, password } = createAuthDto;
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.getTokens(user.id, user.login || user.email, metadata);
  }

  async findMe(id: string): Promise<MeEntity> {
    const user = await this.usersQueryRepository.findUserOrFail({ _id: id });

    return { email: user.email, login: user.login, userId: user.id };
  }

  async confirmCode(confirmCodeDto: ConfirmCodeDto): PromiseResult<boolean> {
    const { code } = confirmCodeDto;
    const result = await this.repository.updateAuthByConfirmCode(code);

    if (!result) {
      return ResultNotification.error(ResultStatus.FORBIDDEN_ERROR, 'Something went wrong');
    }

    return ResultNotification.success(result);
  }

  async registration(registrationDto: RegistrationAuthDto): PromiseResult<string> {
    const user = await this.usersRepository.createUser(registrationDto);
    const code = await this.repository.registerUser(user.id);

    emailManager
      .sendConfirmationEmail(user.email, 'Confirm registration', code)
      .catch((e) => console.error(e));
    return ResultNotification.success(code);
  }

  async resendEmail(resendEmailDto: ResendEmailDto): PromiseResult<string> {
    const { email } = resendEmailDto;
    // TODO not using queryRepository inside command service
    const user = await this.usersQueryRepository.findUserWithoutException({ email: email });
    const authInfo = await this.queryRepository.findAuthInfo({ userId: user?.id });

    if (!authInfo || !user) {
      return ResultNotification.error(ResultStatus.FORBIDDEN_ERROR, 'Something went wrong');
    }

    const code = await this.repository.updateConfirmCode(user.id, authInfo);

    await emailManager.sendConfirmationEmail(email, 'Confirm registration', code);
    return ResultNotification.success(code);
  }

  async clearAll() {
    await this.repository.deleteAll();
  }

  async refreshToken(
    refreshToken: string,
  ): PromiseResult<{ accessToken: string; refreshToken: string }> {
    const authInfo = await this.queryRepository.findAuthInfo({ refreshToken });

    if (!authInfo) {
      return ResultNotification.error(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const { userId } = authInfo;
    const user = await this.usersQueryRepository.findUserOrFail({ _id: userId });

    if (!user) {
      return ResultNotification.error(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const result = await this.getTokens(user.id, user.login || user.email);
    await this.repository.updateAuthInfo({ refreshToken }, { refreshToken: result.refreshToken });
    return ResultNotification.success(result);
  }

  async logout(refreshToken: string): PromiseResult<boolean> {
    const result = await this.repository.updateAuthInfo({ refreshToken }, { refreshToken: '' });

    if (!result) {
      return ResultNotification.error(ResultStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    return ResultNotification.success(true);
  }
}
