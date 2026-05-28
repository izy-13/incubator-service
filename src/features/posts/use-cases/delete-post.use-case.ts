import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repositories';

@Injectable()
export class DeletePostUseCase {
  constructor(private readonly repository: PostsRepository) {}

  execute(id: string) {
    return this.repository.deletePost(id);
  }
}
