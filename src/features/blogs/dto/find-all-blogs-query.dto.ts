import { BlogSortBy } from '../entities/blog.entity';
import { BaseQueryParamsDto } from '../../../common';

export class FindAllBlogsQueryDto extends BaseQueryParamsDto {
  searchNameTerm?: string;

  sortBy: BlogSortBy = 'createdAt';
}
