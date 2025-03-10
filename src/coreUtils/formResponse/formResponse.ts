import { Result, ResultStatus } from '../../types';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

export function formResponse<T>(result: Result<T>): T {
  switch (result.status) {
    case ResultStatus.CREATED:
    case ResultStatus.SUCCESS:
      return result.data;
    case ResultStatus.FORBIDDEN_ERROR:
      throw new ForbiddenException(result.errorMessage);
    case ResultStatus.NOT_FOUND:
      throw new NotFoundException(result.errorMessage);
    case ResultStatus.BAD_REQUEST:
      throw new BadRequestException({ errorsMessages: result.errorMessage });
    default:
      return result.data;
  }
}
