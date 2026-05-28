import { Injectable } from '@nestjs/common';
import { CreatePostWithBlogIdDto } from '../dto/create-post-with-blogId.dto';
import { PostEntity } from '../entities/post.entity';
import { PostsRepository } from '../repositories';

@Injectable()
export class CreatePostUseCase {
  constructor(private readonly repository: PostsRepository) {}

  execute(createPostDto: CreatePostWithBlogIdDto): Promise<PostEntity> {
    return this.repository.createPost(createPostDto);
  }
}
