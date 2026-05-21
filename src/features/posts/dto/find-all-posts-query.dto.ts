import { BaseQueryParamsDto } from '../../../common';
import { PostSortBy } from '../entities/post.entity';

export class FindAllPostsQueryDto extends BaseQueryParamsDto {
  sortBy: PostSortBy = 'createdAt';
}
