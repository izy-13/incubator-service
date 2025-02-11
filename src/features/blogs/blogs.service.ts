import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import { BlogEntity } from './entities/blog.entity';
import { Model } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) {}

  async create(createBlogDto: CreateBlogDto): Promise<BlogEntity> {
    return this.blogModel
      .create(createBlogDto)
      .then(({ _id, name, description, websiteUrl, isMembership, createdAt }) => ({
        id: _id.toJSON(),
        name,
        createdAt: new Date(createdAt || '').toISOString(),
        description,
        websiteUrl,
        isMembership,
      }));
  }

  async findAll(): Promise<BlogEntity[]> {
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

  async findOne(id: string): Promise<BlogEntity> {
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

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogModel
      .findByIdAndUpdate({ _id: id }, updateBlogDto, { new: true })
      .exec()
      .then((result) => {
        if (!result) {
          throw new NotFoundException(`Blog with ID ${id} not found`);
        }
      });
  }

  remove(id: string) {
    return this.blogModel
      .findByIdAndDelete({ _id: id })
      .exec()
      .then((result) => {
        if (!result) {
          throw new NotFoundException(`Blog with ID ${id} not found`);
        }
      });
  }

  clearAll() {
    return this.blogModel.deleteMany({}).exec();
  }
}
