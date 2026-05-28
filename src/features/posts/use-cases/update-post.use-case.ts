import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsRepository } from '../repositories';

@Injectable()
export class UpdatePostUseCase {
  constructor(private readonly repository: PostsRepository) {}

  execute(id: string, updatePostDto: UpdatePostDto) {
    return this.repository.updatePost(id, updatePostDto);
  }
}