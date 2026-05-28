import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '../../../common';
import { FindAllPostsQueryDto } from '../dto/find-all-posts-query.dto';
import { PostEntity } from '../entities/post.entity';
import { PostsQueryRepository } from '../repositories';

@Injectable()
export class FindPostsByBlogUseCase {
  constructor(private readonly queryRepository: PostsQueryRepository) {}

  execute(
    blogId: string,
    queryParams: FindAllPostsQueryDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    const defaultParams = new FindAllPostsQueryDto();

    const {
      pageNumber = defaultParams.pageNumber,
      sortDirection = defaultParams.sortDirection,
      sortBy = defaultParams.sortBy,
      pageSize = defaultParams.pageSize,
    } = queryParams;

    return this.queryRepository.findAllPostsByBlogId(blogId, {
      pageNumber,
      sortDirection,
      sortBy,
      pageSize,
    });
  }
}