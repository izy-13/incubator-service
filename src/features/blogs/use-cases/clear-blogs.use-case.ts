import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repositories';

@Injectable()
export class ClearBlogsUseCase {
  constructor(private readonly repository: BlogsRepository) {}

  execute() {
    return this.repository.deleteAllBlogs();
  }
}
