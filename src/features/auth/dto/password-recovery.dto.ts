import { IsNotEmpty, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class PasswordRecoveryDto {
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsUrl()
  email: string;
}
