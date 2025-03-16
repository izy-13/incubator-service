import { IsNotEmpty, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsUnique } from '../../../decorators';
import { User } from '../../users/schemas/user.schema';
import { RegisterAuthValidator } from '../decorators';

// TODO Mostly primitives checks
export class RegistrationAuthDto {
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
  @RegisterAuthValidator()
  email: string;
}
