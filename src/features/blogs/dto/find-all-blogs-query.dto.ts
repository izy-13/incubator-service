import { BlogSortBy } from '../entities/blog.entity';
import { BaseQueryParamsDto } from '../../../coreUtils';

export class FindAllBlogsQueryDto extends BaseQueryParamsDto {
  searchNameTerm?: string;

  sortBy: BlogSortBy = 'createdAt';
}
