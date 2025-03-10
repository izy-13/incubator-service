import { PaginatedResponse } from './paginatedResponseType';

export type ExtensionType = {
  field: string | null;
  message: string;
};

export enum ResultStatus {
  CREATED = 'CREATED',
  FORBIDDEN_ERROR = 'FORBIDDEN_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SUCCESS = 'SUCCESS',
  BAD_REQUEST = 'BAD_REQUEST',
}

export type Result<T = null> = {
  status: ResultStatus;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};

export type PromiseResult<T> = Promise<Result<T>>;

export type PaginatedPromiseResult<T> = Promise<Result<PaginatedResponse<T>>>;
