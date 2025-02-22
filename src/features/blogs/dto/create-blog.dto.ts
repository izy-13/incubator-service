import { IsNotEmpty, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(1)
  @MaxLength(15)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(1)
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsUrl()
  @MaxLength(100)
  websiteUrl: string;

  isMembership?: boolean;
}
