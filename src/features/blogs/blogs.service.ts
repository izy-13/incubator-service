import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  private blogs: Blog[] = [
    {
      createdAt: new Date().toISOString(),
      description: 'some description',
      id: '11',
      isMembership: false,
      name: 'some name',
      websiteUrl: 'www.google.com',
    },
  ];

  create(createBlogDto: CreateBlogDto) {
    const newBlog: Blog = {
      id: Math.floor(Math.random() * 100000).toString(),
      ...createBlogDto,
      // isMembership: false,
      // createdAt: new Date().toISOString(),
    };

    this.blogs.push(newBlog);
    return newBlog;
  }

  findAll() {
    return this.blogs;
  }

  findOne(id: string): Blog {
    const blog = this.blogs.find((post) => post.id === id);

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    return blog;
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    const blogIndex = this.blogs.findIndex((post) => post.id === id);

    if (blogIndex === -1) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    this.blogs[blogIndex] = {
      ...this.blogs[blogIndex],
      ...updateBlogDto,
    };
  }

  remove(id: string) {
    const blogIndex = this.blogs.findIndex((post) => post.id === id);

    if (blogIndex === -1) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    this.blogs.splice(blogIndex, 1);
  }

  clearAll() {
    this.blogs = [];
  }
}
