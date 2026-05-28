import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { FindBlogUseCase } from '../use-cases';

import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class BlogExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly findBlogUseCase: FindBlogUseCase) {}

  async validate(blogId: string) {
    try {
      const blog = await this.findBlogUseCase.execute(blogId);
      return !!blog;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  defaultMessage() {
    return 'Blog with ID $value not found';
  }
}

export function BlogExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: BlogExistsConstraint,
    });
  };
}
