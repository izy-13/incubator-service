import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class NewPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  recoveryCode: string;
}
