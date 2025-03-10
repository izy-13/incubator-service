import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AuthQueryRepository } from '../repositories';
import { Injectable } from '@nestjs/common';
import { isBefore } from 'date-fns/isBefore';

@ValidatorConstraint({ async: true })
@Injectable()
export class CodeAuthExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly queryRepository: AuthQueryRepository) {}

  async validate(code: string) {
    try {
      const codeAuth = await this.queryRepository.findAuthInfo({ code });
      const expiredAt = codeAuth?.expiredAt || '';
      const now = new Date();

      if (!codeAuth || codeAuth?.isConfirmed || isBefore(now, expiredAt)) {
        return false;
      }

      return !!codeAuth;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  defaultMessage() {
    return 'Invalid code';
  }
}

export function CodeAuthExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CodeAuthExistsConstraint,
    });
  };
}
