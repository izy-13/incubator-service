import { InjectModel } from '@nestjs/mongoose';
import { PostDb } from '../schemas/post.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';

export class PostsQueryRepository {
  constructor(@InjectModel(PostDb.name) private readonly postModel: Model<PostDb>) {}

  async findAllPosts() {
    const posts = await this.postModel.find().exec();
    // TODO adjust data transform for avoid copycode
    return posts.map(({ _id, title, content, createdAt, blogId, blogName, shortDescription }) => ({
      id: _id.toJSON(),
      title,
      content,
      shortDescription,
      createdAt: new Date(createdAt || '').toISOString(),
      blogId: blogId.toJSON(),
      blogName,
    }));
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
}
