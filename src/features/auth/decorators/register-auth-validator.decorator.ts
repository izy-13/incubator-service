import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RegistrationAuthDto } from '../dto';
import { AuthQueryRepository } from '../repositories';
import { UsersQueryRepository } from '../../users/repositories';
import { isBefore } from 'date-fns/isBefore';

@ValidatorConstraint({ async: true })
@Injectable()
export class RegisterAuthValidatorConstraint {
  constructor(
    @Inject(forwardRef(() => UsersQueryRepository))
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly queryRepository: AuthQueryRepository,
  ) {}

  async validate(body: RegistrationAuthDto) {
    try {
      const filter = { email: body };

      const user = await this.usersQueryRepository.findUserWithoutException(filter);

      if (!user) {
        return true;
      }

      const codeAuth = await this.queryRepository.findAuthInfo({ userId: user.id });

      if (!codeAuth) {
        return true;
      }

      return !(codeAuth.isConfirmed || isBefore(new Date(), codeAuth.expiredAt));
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  defaultMessage() {
    return 'Confirmed or expired';
  }
}

export function RegisterAuthValidator() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {},
      constraints: [],
      validator: RegisterAuthValidatorConstraint,
    });
  };
}
