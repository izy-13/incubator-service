import { Injectable } from '@nestjs/common';
import { ClearCommentsUseCase } from '../../comments/use-cases';
import { PostsRepository } from '../repositories';

@Injectable()
export class ClearPostsUseCase {
  constructor(
    private readonly repository: PostsRepository,
    private readonly clearCommentsUseCase: ClearCommentsUseCase,
  ) {}

  async execute() {
    await this.repository.deleteAllPosts();
    await this.clearCommentsUseCase.execute();
  }
}
