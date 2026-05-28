import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repositories';

@Injectable()
export class DeleteBlogUseCase {
  constructor(private readonly repository: BlogsRepository) {}

  execute(id: string) {
    return this.repository.deleteBlog(id);
  }
}
