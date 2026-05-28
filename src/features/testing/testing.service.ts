import { Injectable } from '@nestjs/common';
import { BlogsService } from '../blogs/blogs.service';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../user/application';
import { ClearAuthUseCase } from '../auth/use-cases';
import { DeviceSecurityService } from '../device-security/application/device-security.service';

@Injectable()
export class TestingService {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly clearAuthUseCase: ClearAuthUseCase,
    private readonly deviceSecurityService: DeviceSecurityService,
  ) {}

  async remove() {
    await this.blogsService.clearAll();
    await this.postsService.clearAll();
    await this.usersService.clearAll();
    await this.clearAuthUseCase.execute();
    await this.deviceSecurityService.clearAll();
  }
}
