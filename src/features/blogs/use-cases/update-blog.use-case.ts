import { Injectable } from '@nestjs/common';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogsRepository } from '../repositories';

@Injectable()
export class UpdateBlogUseCase {
  constructor(private readonly repository: BlogsRepository) {}

  execute(id: string, updateBlogDto: UpdateBlogDto) {
    return this.repository.updateBlog(id, updateBlogDto);
  }
}