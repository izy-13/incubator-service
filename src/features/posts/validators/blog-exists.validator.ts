import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsService } from '../../blogs/blogs.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: false })
@Injectable()
export class BlogExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogsService: BlogsService) {}

  validate(blogId: string) {
    const blog = this.blogsService?.findAll().find((blog) => blog.id === blogId);
    return !!blog;
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
