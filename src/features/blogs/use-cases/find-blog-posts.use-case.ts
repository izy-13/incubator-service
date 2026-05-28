import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '../../../common';
import { FindAllPostsQueryDto } from '../../posts/dto/find-all-posts-query.dto';
import { PostEntity } from '../../posts/entities/post.entity';
import { FindPostsByBlogUseCase } from '../../posts/use-cases';

@Injectable()
export class FindBlogPostsUseCase {
  constructor(private readonly findPostsByBlogUseCase: FindPostsByBlogUseCase) {}

  execute(
    blogId: string,
    queryParams: FindAllPostsQueryDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    return this.findPostsByBlogUseCase.execute(blogId, queryParams);
  }
}
