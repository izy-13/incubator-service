import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogEntity } from '../entities/blog.entity';
import { BlogsRepository } from '../repositories';

@Injectable()
export class CreateBlogUseCase {
  constructor(private readonly repository: BlogsRepository) {}

  execute(createBlogDto: CreateBlogDto): Promise<BlogEntity | void> {
    return this.repository.createBlog(createBlogDto);
  }
}
