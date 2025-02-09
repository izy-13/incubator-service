import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { BlogsService } from '../blogs/blogs.service';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      blogId: '11',
      blogName: 'Blog name',
      content: 'some content',
      id: '1',
      shortDescription: 'short desc',
      title: 'some title',
      createdAt: new Date().toISOString(),
    },
  ];

  constructor(private readonly blogsService: BlogsService) {}

  create(createPostDto: CreatePostDto) {
    const blog = this.blogsService.findOne(createPostDto.blogId);

    const newPost: Post = {
      id: Math.floor(Math.random() * 100000).toString(),
      ...createPostDto,
      // createdAt: new Date().toISOString(),
      blogName: blog.name,
    };

    this.posts.push(newPost);
    return newPost;
  }

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: string): Post {
    const post = this.posts.find((post) => post.id === id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    const postIndex = this.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updatePostDto,
    };
  }

  remove(id: string) {
    const postIndex = this.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    this.posts.splice(postIndex, 1);
  }

  clearAll() {
    this.posts = [];
  }
}
