import { InjectModel } from '@nestjs/mongoose';
import { PostDb } from '../schemas/post.schema';
import { Model, Types } from 'mongoose';
import { UpdatePostDto } from '../dto/update-post.dto';
import { forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';
import { CreatePostWithBlogIdDto } from '../dto/create-post-with-blogId.dto';
import { BlogsService } from '../../blogs/blogs.service';

export class PostsRepository {
  constructor(
    @Inject(forwardRef(() => BlogsService))
    private readonly blogsService: BlogsService,
    @InjectModel(PostDb.name) private readonly postModel: Model<PostDb>,
  ) {}

  async createPost(createPostDto: CreatePostWithBlogIdDto): Promise<PostEntity> {
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
        createdAt: createdAt ? new Date(createdAt || '').toISOString() : '',
        blogId: blogId.toJSON(),
        blogName: blogName,
      }));
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel
      .findByIdAndUpdate({ _id: id }, updatePostDto, { new: true })
      .exec()
      .then((result) => {
        if (!result) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
      });
  }

  async deletePost(id: string) {
    return this.postModel
      .findByIdAndDelete({ _id: id })
      .exec()
      .then((result) => {
        if (!result) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
      });
  }

  async deleteAllPosts() {
    return this.postModel.deleteMany({}).exec();
  }
}
