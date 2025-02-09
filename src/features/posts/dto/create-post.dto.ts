import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { BlogExists } from '../validators/blog-exists.validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(1)
  @MaxLength(100)
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @BlogExists()
  blogId: string;
}
