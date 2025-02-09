import { BadRequestException, ValidationError } from '@nestjs/common';

export const transformValidationFactory = (validationErrors: ValidationError[] = []) => {
  return new BadRequestException({
    errorsMessages: validationErrors.map((error) => ({
      message: 'invalid value',
      field: error.property,
    })),
  });
};
