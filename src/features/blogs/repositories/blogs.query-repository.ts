import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../schemas/blog.schema';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogEntity } from '../entities/blog.entity';
import { FindAllBlogsQueryDto } from '../dto/find-all-blogs-query.dto';
import { PaginatedResponse } from '../../../types';
import { formatPaginatedResponse } from '../../../coreUtils';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) {}

  async findAllBlogs(queryParams: FindAllBlogsQueryDto): Promise<PaginatedResponse<BlogEntity>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = queryParams;

    const filter = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};
    const totalCount = await this.blogModel.countDocuments(filter).exec();

    const blogs = await this.blogModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1, _id: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    // TODO adjust data transform for avoid copycode
    const items: BlogEntity[] = blogs.map(({ _id, name, description, websiteUrl, isMembership, createdAt }) => ({
      id: _id.toJSON(),
      name,
      createdAt: new Date(createdAt || '').toISOString(),
      description,
      websiteUrl,
      isMembership,
    }));

    return formatPaginatedResponse<BlogEntity>({ page: pageNumber, items, pageSize, totalCount });
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
