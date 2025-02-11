import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostDb } from './schemas/post.schema';
import { BlogsService } from '../blogs/blogs.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    private readonly blogsService: BlogsService,
    @InjectModel(PostDb.name) private readonly postModel: Model<PostDb>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const blog = await this.blogsService.findOne(createPostDto.blogId);

    const newPost: PostDb = {
      ...createPostDto,
      blogName: blog.name,
      blogId: new Types.ObjectId(blog.id),
    };

    return this.postModel
      .create(newPost)
      .then(({ _id, title, content, shortDescription, createdAt, blogId, blogName }) => ({
        id: _id.toJSON(),
        title,
        content,
        shortDescription,
        createdAt: new Date(createdAt || '').toISOString(),
        blogId: blogId.toJSON(),
        blogName: blogName,
      }));
  }

  async findAll(): Promise<PostEntity[]> {
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

  async findOne(id: string): Promise<PostEntity> {
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

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel
      .findByIdAndUpdate({ _id: id }, updatePostDto, { new: true })
      .exec()
      .then((result) => {
        if (!result) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
      });
  }

  async remove(id: string) {
    return this.postModel
      .findByIdAndDelete({ _id: id })
      .exec()
      .then((result) => {
        if (!result) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
      });
  }

  clearAll() {
    return this.postModel.deleteMany({}).exec();
  }
}
