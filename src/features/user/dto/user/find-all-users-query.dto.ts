import { UserSortBy } from '../../api';
import { BaseQueryParamsDto } from '../../../../common';

export class FindAllUsersQueryDto extends BaseQueryParamsDto {
  sortBy: UserSortBy = 'createdAt';
  searchLoginTerm?: string;
  searchEmailTerm?: string;
}
