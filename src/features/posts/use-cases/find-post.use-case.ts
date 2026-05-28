import { Injectable } from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';
import { PostsQueryRepository } from '../repositories';

@Injectable()
export class FindPostUseCase {
  constructor(private readonly queryRepository: PostsQueryRepository) {}

  execute(id: string): Promise<PostEntity> {
    return this.queryRepository.findPostById(id);
  }
}