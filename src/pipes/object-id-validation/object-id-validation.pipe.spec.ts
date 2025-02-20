import { ObjectIdValidationPipe } from './object-id-validation.pipe';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

describe('ObjectIdValidationPipe', () => {
  it('should throw BadRequestException for invalid ObjectId', () => {
    const pipe = new ObjectIdValidationPipe();
    expect(() => pipe.transform('invalidObjectId')).toThrow(BadRequestException);
  });

  it('should return the value for valid ObjectId', () => {
    const pipe = new ObjectIdValidationPipe();
    const validObjectId = new Types.ObjectId().toHexString();
    expect(pipe.transform(validObjectId)).toBe(validObjectId);
  });

  it('should throw BadRequestException for empty string', () => {
    const pipe = new ObjectIdValidationPipe();
    expect(() => pipe.transform('')).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for null value', () => {
    const pipe = new ObjectIdValidationPipe();
    expect(() => pipe.transform(null as unknown as string)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for undefined value', () => {
    const pipe = new ObjectIdValidationPipe();
    expect(() => pipe.transform(undefined as unknown as string)).toThrow(BadRequestException);
  });
});
