import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersQueryRepository } from '../users/repositories';

@Injectable()
export class AuthService {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  create(createAuthDto: CreateAuthDto) {
    const { loginOrEmail, password } = createAuthDto;
    return this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail, password);
  }
}
