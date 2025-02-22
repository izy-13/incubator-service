import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../schemas/blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogEntity } from '../entities/blog.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBlogDto } from '../dto/update-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) {}

  async createBlog(createBlogDto: CreateBlogDto): Promise<BlogEntity | void> {
    return this.blogModel
      .create(createBlogDto)
      .then(({ _id, name, description, websiteUrl, isMembership, createdAt }) => ({
        id: _id.toJSON(),
        name,
        createdAt: createdAt ? new Date(createdAt || '').toISOString() : '',
        description,
        websiteUrl,
        isMembership,
      }))
      .catch((error) => {
        console.error(error);
      });
  }

  async deleteBlog(id: string) {
    return this.blogModel
      .findByIdAndDelete({ _id: id })
      .exec()
      .then((result) => {
        if (!result) {
          throw new NotFoundException(`Blog with ID ${id} not found`);
        }
      });
  }

  async updateBlog(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogModel
      .findByIdAndUpdate({ _id: id }, updateBlogDto, { new: true })
      .exec()
      .then((result) => {
        if (!result) {
          throw new NotFoundException(`Blog with ID ${id} not found`);
        }
      });
  }

  async deleteAllBlogs() {
    return await this.blogModel.deleteMany({}).exec();
  }
}
