import { IsNotEmpty, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import { ResendAuthValidator } from '../decorators';

export class ResendEmailDto {
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsUrl()
  @ResendAuthValidator()
  email: string;
}
