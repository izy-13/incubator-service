import { PaginatedResponse } from '../../types';

export function formatPaginatedResponse<T>(props: Omit<PaginatedResponse<T>, 'pagesCount'>): PaginatedResponse<T> {
  const { pageSize, totalCount, items, page } = props;
  const pagesCount = Math.ceil(totalCount / pageSize);
  return {
    pagesCount,
    page: +page,
    pageSize: +pageSize,
    totalCount,
    items,
  };
}
