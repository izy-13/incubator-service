import { BadRequestException, ValidationError } from '@nestjs/common';
import { ExtensionType, Result, ResultStatus } from '../types';

export class ResultNotification<T = null> {
  constructor(
    public status: ResultStatus,
    public data: T = null as T,
    public errorMessage: string = '',
    public extensions: ExtensionType[] = [],
  ) {}

  static success<T>(data: T = null as T, status: ResultStatus = ResultStatus.SUCCESS): Result<T> {
    return new ResultNotification(status, data);
  }

  static error<T>(
    status: ResultStatus = ResultStatus.BAD_REQUEST,
    errorMessage: string = '',
    extensions: ExtensionType[] = [],
  ): Result<T> {
    return new ResultNotification<T>(status, null as T, errorMessage, extensions);
  }

  static validate(this: void, validationErrors: ValidationError[] = []) {
    const extensions: ExtensionType[] = validationErrors.map((error) => ({
      message: 'invalid value',
      field: error.property,
    }));

    return new BadRequestException({ errorsMessages: extensions });
  }
}
