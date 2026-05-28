import { Injectable } from '@nestjs/common';
import { BlogEntity } from '../entities/blog.entity';
import { BlogsQueryRepository } from '../repositories';

@Injectable()
export class FindBlogUseCase {
  constructor(private readonly queryRepository: BlogsQueryRepository) {}

  execute(id: string): Promise<BlogEntity> {
    return this.queryRepository.findBlogById(id);
  }
}
