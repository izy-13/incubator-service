import { IsNotEmpty, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsUnique } from '../../../decorators';
import { User } from '../schemas/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(3)
  @MaxLength(10)
  @IsUnique(User, 'login')
  login: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsUrl()
  @IsUnique(User, 'email')
  email: string;
}
