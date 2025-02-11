import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsService } from '../../blogs/blogs.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class BlogExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogsService: BlogsService) {}

  async validate(blogId: string) {
    // TODO need another method to findOne only for validation, without throwing an NotFoundException
    const blogs = await this.blogsService?.findAll();
    return !!blogs.find((blog) => blog.id === blogId);
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
