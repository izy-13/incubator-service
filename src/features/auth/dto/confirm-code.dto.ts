import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { CodeAuthExists } from '../decorators';

export class ConfirmCodeDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @CodeAuthExists()
  code: string;
}
