import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepository } from '../repositories';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class CodeAuthExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly queryRepository: UsersQueryRepository) {}

  async validate(code: string) {
    try {
      const codeAuth = await this.queryRepository.findAuthInfo({ 'authInfo.code': code });
      // const expiredAt = codeAuth?.expiredAt || '';

      if (!codeAuth || codeAuth?.isConfirmed) {
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
