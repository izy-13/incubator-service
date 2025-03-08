import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersQueryRepository } from '../users/repositories';
import { JwtService } from '@nestjs/jwt';
import { MeEntity } from './entity/me.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<{ accessToken: string }> {
    const { loginOrEmail, password } = createAuthDto;
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, loginOrEmail: user.login || user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async findMe(id: string): Promise<MeEntity> {
    const user = await this.usersQueryRepository.findUserById(id);

    return { email: user.email, login: user.login, userId: user.id };
  }
}
