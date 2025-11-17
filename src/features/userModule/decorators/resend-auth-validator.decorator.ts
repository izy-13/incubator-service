import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ResendEmailDto } from '../dto';
import { UsersQueryRepository } from '../repositories';
import { isBefore } from 'date-fns/isBefore';

@ValidatorConstraint({ async: true })
@Injectable()
export class ResendAuthValidatorConstraint {
  constructor(
    @Inject(forwardRef(() => UsersQueryRepository))
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async validate(email: ResendEmailDto) {
    try {
      const authInfo = await this.usersQueryRepository.findAuthInfo({ email });

      if (!authInfo) {
        return false;
      }

      return !authInfo.isConfirmed && !isBefore(new Date(), authInfo.createdAt);
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  defaultMessage() {
    return 'Confirmed or expired';
  }
}

export function ResendAuthValidator() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: ResendAuthValidatorConstraint,
    });
  };
}
