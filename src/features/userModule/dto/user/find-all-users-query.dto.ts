import { UserSortBy } from '../../api';
import { BaseQueryParamsDto } from '../../../../coreUtils';

export class FindAllUsersQueryDto extends BaseQueryParamsDto {
  sortBy: UserSortBy = 'createdAt';
  searchLoginTerm?: string;
  searchEmailTerm?: string;
}
