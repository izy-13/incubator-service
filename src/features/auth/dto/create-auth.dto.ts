import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(3)
  @MaxLength(20)
  loginOrEmail: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
