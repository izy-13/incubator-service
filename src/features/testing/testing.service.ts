import { Injectable } from '@nestjs/common';
import { BlogsService } from '../blogs/blogs.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class TestingService {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
  ) {}

  async remove() {
    await this.blogsService.clearAll();
    await this.postsService.clearAll();
  }
}
