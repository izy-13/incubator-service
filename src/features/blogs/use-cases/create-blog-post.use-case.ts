import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../../posts/dto/create-post.dto';
import { CreatePostUseCase } from '../../posts/use-cases';

@Injectable()
export class CreateBlogPostUseCase {
  constructor(private readonly createPostUseCase: CreatePostUseCase) {}

  execute(blogId: string, createPostDto: CreatePostDto) {
    return this.createPostUseCase.execute({ ...createPostDto, blogId });
  }
}
