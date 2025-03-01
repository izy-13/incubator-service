import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, Type } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueValidator<T> implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: unknown, args: ValidationArguments) {
    const [model, property] = args.constraints as [Type<T>, keyof T];
    const modelInstance = this.connection.model<T>(model.name);
    const filter: Record<string, unknown> = { [property]: value };
    const document = await modelInstance.findOne(filter);
    return !document;
  }

  defaultMessage(args: ValidationArguments) {
    const [, property] = args.constraints as [Type<T>, keyof T];
    return `${String(property)} must be unique.`;
  }
}

export function IsUnique<T>(model: Type<T>, property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, property],
      validator: UniqueValidator<T>,
    });
  };
}
