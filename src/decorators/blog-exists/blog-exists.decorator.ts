import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsService } from '../../features/blogs/blogs.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class BlogExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogsService: BlogsService) {}

  async validate(blogId: string) {
    try {
      const blog = await this.blogsService?.findOne(blogId);
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
