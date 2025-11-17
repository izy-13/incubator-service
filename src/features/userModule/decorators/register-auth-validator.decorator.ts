import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RegistrationAuthDto } from '../dto';
import { UsersQueryRepository } from '../repositories';
import { isBefore } from 'date-fns/isBefore';

// TODO better to be in BLL
@ValidatorConstraint({ async: true })
@Injectable()
export class RegisterAuthValidatorConstraint {
  constructor(
    @Inject(forwardRef(() => UsersQueryRepository))
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async validate(body: RegistrationAuthDto) {
    try {
      const filter = { email: body };

      const authInfo = await this.usersQueryRepository.findAuthInfo(filter);

      if (!authInfo) {
        return true;
      }

      return !(authInfo.isConfirmed || isBefore(new Date(), authInfo.createdAt));
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
