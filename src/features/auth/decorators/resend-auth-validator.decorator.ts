import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ResendEmailDto } from '../dto';
import { AuthQueryRepository } from '../repositories';
import { UsersQueryRepository } from '../../users/repositories';
import { isBefore } from 'date-fns/isBefore';

@ValidatorConstraint({ async: true })
@Injectable()
export class ResendAuthValidatorConstraint {
  constructor(
    @Inject(forwardRef(() => UsersQueryRepository))
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly queryRepository: AuthQueryRepository,
  ) {}

  async validate(email: ResendEmailDto) {
    try {
      const user = await this.usersQueryRepository.findUserWithoutException({ email });

      if (!user) {
        return false;
      }

      const codeAuth = await this.queryRepository.findAuthInfo({ userId: user.id });

      if (!codeAuth) {
        return false;
      }

      return !codeAuth.isConfirmed && !isBefore(new Date(), codeAuth.expiredAt);
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
