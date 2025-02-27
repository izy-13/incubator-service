import { SortDirection } from '../../types';

export class BaseQueryParamsDto {
  sortBy: string = 'createdAt';
  sortDirection: SortDirection = 'desc';
  pageNumber: number = 1;
  pageSize: number = 10;
}
