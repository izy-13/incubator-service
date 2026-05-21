import { BaseQueryParamsDto } from '../../../common';
import { CommentSortBy } from '../entities/comment.entity';

export class FindAllCommentsQueryDto extends BaseQueryParamsDto {
  sortBy: CommentSortBy = 'createdAt';
}
