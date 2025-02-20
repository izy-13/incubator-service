import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import { BlogEntity } from './entities/blog.entity';
import { Model } from 'mongoose';
import { BlogsQueryRepository, BlogsRepository } from './repositories';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    private readonly queryRepository: BlogsQueryRepository,
    private readonly repository: BlogsRepository,
  ) {}

  create(createBlogDto: CreateBlogDto): Promise<BlogEntity | void> {
    return this.repository.createBlog(createBlogDto);
  }

  findAll(): Promise<BlogEntity[]> {
    return this.queryRepository.findAllBlogs();
  }

  findOne(id: string): Promise<BlogEntity> {
    return this.queryRepository.findBlogById(id);
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.repository.updateBlog(id, updateBlogDto);
  }

  remove(id: string) {
    return this.repository.deleteBlog(id);
  }

  clearAll() {
    return this.repository.deleteAllBlogs();
  }
}
