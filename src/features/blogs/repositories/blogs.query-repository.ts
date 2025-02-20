import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../schemas/blog.schema';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogEntity } from '../entities/blog.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) {}

  async findAllBlogs(): Promise<BlogEntity[]> {
    const blogs = await this.blogModel.find().exec();
    // TODO adjust data transform for avoid copycode
    return blogs.map(({ _id, name, description, websiteUrl, isMembership, createdAt }) => ({
      id: _id.toJSON(),
      name,
      createdAt: new Date(createdAt || '').toISOString(),
      description,
      websiteUrl,
      isMembership,
    }));
  }

  async findBlogById(id: string): Promise<BlogEntity> {
    return this.blogModel
      .findOne({ _id: id })
      .exec()
      .then((result) => {
        if (!result) {
          throw new NotFoundException(`Blog with ID ${id} not found`);
        } else {
          const { _id, name, createdAt, description, websiteUrl, isMembership } = result;

          return {
            id: _id.toJSON(),
            name,
            createdAt: new Date(createdAt || '').toISOString(),
            description,
            websiteUrl,
            isMembership,
          };
        }
      });
  }
}
