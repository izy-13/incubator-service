import { ExtensionType, Result, ResultStatus } from '../../types';

// TODO rework into class
export function createResultFactory<T>(
  status: ResultStatus,
  data: T,
  errorMessage: string = '',
  extensions: ExtensionType[] = [],
): Result<T> {
  return {
    status,
    data,
    errorMessage,
    extensions,
  };
}

export const successResult = <T>(status: ResultStatus, data: T): Result<T> => createResultFactory(status, data);

export const errorResult = <T>(status: ResultStatus, errorMessage: string, extensions?: ExtensionType[]): Result<T> =>
  createResultFactory<T>(status, null as T, errorMessage, extensions);
