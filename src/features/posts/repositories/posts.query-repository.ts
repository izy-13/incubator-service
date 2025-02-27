import { InjectModel } from '@nestjs/mongoose';
import { PostDb } from '../schemas/post.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';
import { FindAllPostsQueryDto } from '../dto/find-all-posts-query.dto';
import { PaginatedResponse } from '../../../types';
import { formatPaginatedResponse } from '../../../coreUtils';

export class PostsQueryRepository {
  constructor(@InjectModel(PostDb.name) private readonly postModel: Model<PostDb>) {}

  async findAllPosts(queryParams: FindAllPostsQueryDto): Promise<PaginatedResponse<PostEntity>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;

    const totalCount = await this.postModel.countDocuments().exec();
    const posts = await this.postModel
      .find()
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1, _id: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    // TODO adjust data transform for avoid copycode
    const items: PostEntity[] = posts.map(({ _id, title, content, createdAt, blogId, blogName, shortDescription }) => ({
      id: _id.toJSON(),
      title,
      content,
      shortDescription,
      createdAt: new Date(createdAt || '').toISOString(),
      blogId: blogId.toJSON(),
      blogName,
    }));

    return formatPaginatedResponse<PostEntity>({ page: pageNumber, items, pageSize, totalCount });
  }

  async findPostById(id: string): Promise<PostEntity> {
    return this.postModel
      .findOne({ _id: id })
      .exec()
      .then((result) => {
        if (!result) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        } else {
          const { _id, title, content, shortDescription, createdAt, blogId, blogName } = result;

          return {
            id: _id.toJSON(),
            title,
            content,
            shortDescription,
            createdAt: new Date(createdAt || '').toISOString(),
            blogId: blogId.toJSON(),
            blogName,
          };
        }
      });
  }

  async findAllPostsByBlogId(
    blogId: string,
    queryParams: FindAllPostsQueryDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;

    const totalCount = await this.postModel.countDocuments({ blogId }).exec();

    if (!totalCount) {
      throw new NotFoundException(`Post with ID ${blogId} not found`);
    }

    const posts = await this.postModel
      .find({ blogId })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1, _id: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const items: PostEntity[] = posts.map(({ _id, title, content, createdAt, blogId, blogName, shortDescription }) => ({
      id: _id.toJSON(),
      title,
      content,
      shortDescription,
      createdAt: new Date(createdAt || '').toISOString(),
      blogId: blogId.toJSON(),
      blogName,
    }));

    return formatPaginatedResponse<PostEntity>({ page: pageNumber, items, pageSize, totalCount });
  }
}
