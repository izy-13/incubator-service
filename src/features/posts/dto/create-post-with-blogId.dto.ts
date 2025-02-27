import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { BlogExists } from '../../../decorators';

export class CreatePostWithBlogIdDto extends CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @BlogExists()
  blogId: string;
}
