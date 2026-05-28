import { Injectable } from '@nestjs/common';
import { ConfirmCodeDto } from '../dto';
import { PromiseResult, ResultNotification, ResultStatus } from '../../../common';
import { AuthRepository } from '../repositories';

@Injectable()
export class ConfirmCodeUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(confirmCodeDto: ConfirmCodeDto): PromiseResult<boolean> {
    const result = await this.authRepository.confirmRegistrationByCode(confirmCodeDto.code);

    if (!result) {
      return ResultNotification.error(ResultStatus.FORBIDDEN_ERROR, 'Something went wrong');
    }

    return ResultNotification.success(result);
  }
}
