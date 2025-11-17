import { Injectable } from '@nestjs/common';
import { BlogsService } from '../blogs/blogs.service';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../userModule/application';

@Injectable()
export class TestingService {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  async remove() {
    await this.blogsService.clearAll();
    await this.postsService.clearAll();
    await this.usersService.clearAll();
  }
}
