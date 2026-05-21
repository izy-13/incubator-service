import { Injectable } from '@nestjs/common';
import { BlogsService } from '../blogs/blogs.service';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../user/application';
import { AuthService } from '../auth/auth.service';
import { DeviceSecurityService } from '../device-security/application/device-security.service';

@Injectable()
export class TestingService {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly deviceSecurityService: DeviceSecurityService,
  ) {}

  async remove() {
    await this.blogsService.clearAll();
    await this.postsService.clearAll();
    await this.usersService.clearAll();
    await this.authService.clearAll();
    await this.deviceSecurityService.clearAll();
  }
}
