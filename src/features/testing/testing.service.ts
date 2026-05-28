import { Injectable } from '@nestjs/common';
import { ClearBlogsUseCase } from '../blogs/use-cases';
import { ClearPostsUseCase } from '../posts/use-cases';
import { ClearUsersUseCase } from '../user/use-cases';
import { ClearAuthUseCase } from '../auth/use-cases';
import { ClearDeviceSecurityUseCase } from '../device-security/use-cases';

@Injectable()
export class TestingService {
  constructor(
    private readonly clearBlogsUseCase: ClearBlogsUseCase,
    private readonly clearPostsUseCase: ClearPostsUseCase,
    private readonly clearUsersUseCase: ClearUsersUseCase,
    private readonly clearAuthUseCase: ClearAuthUseCase,
    private readonly clearDeviceSecurityUseCase: ClearDeviceSecurityUseCase,
  ) {}

  async remove() {
    await this.clearBlogsUseCase.execute();
    await this.clearPostsUseCase.execute();
    await this.clearUsersUseCase.execute();
    await this.clearAuthUseCase.execute();
    await this.clearDeviceSecurityUseCase.execute();
  }
}
