import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BlogsQueryRepository } from '../blogs.query-repository';
import { Blog } from '../../schemas/blog.schema';
import { NotFoundException } from '@nestjs/common';
import { dbConnect, dbDisconnect } from '../../../../coreUtils';

describe('BlogsQueryRepository', () => {
  let blogsQueryRepository: BlogsQueryRepository;
  const connection: mongoose.Connection = mongoose.connection;
  let blogModel: Model<Blog>;

  beforeAll(async () => {
    await dbConnect();

    const blogSchema = new mongoose.Schema({
      name: String,
      description: String,
      websiteUrl: String,
      isMembership: Boolean,
      createdAt: Date,
    });

    blogModel = connection.model<Blog>('Blog', blogSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsQueryRepository,
        {
          provide: getModelToken(Blog.name),
          useValue: blogModel,
        },
      ],
    }).compile();

    blogsQueryRepository = module.get<BlogsQueryRepository>(BlogsQueryRepository);
  });

  afterAll(async () => {
    await dbDisconnect();
  });

  beforeEach(async () => {
    await blogModel.deleteMany({});
  });

  it('should return an empty array when no blogs exist', async () => {
    const blogs = await blogsQueryRepository.findAllBlogs();
    expect(blogs).toEqual([]);
  });

  it('should return all blogs', async () => {
    await blogModel.create({
      name: 'Test Blog',
      description: 'Test Description',
      websiteUrl: 'https://test.com',
      isMembership: false,
      createdAt: new Date(),
    });

    const blogs = await blogsQueryRepository.findAllBlogs();
    expect(blogs).toHaveLength(1);
    expect(blogs[0].name).toBe('Test Blog');
  });

  it('should return a blog by ID', async () => {
    const blog = await blogModel.create({
      name: 'Test Blog',
      description: 'Test Description',
      websiteUrl: 'https://test.com',
      isMembership: false,
      createdAt: new Date(),
    });

    const foundBlog = await blogsQueryRepository.findBlogById(blog._id.toString());
    expect(foundBlog.name).toBe(blog.name);
  });

  it('should throw NotFoundException if blog is not found', async () => {
    await expect(blogsQueryRepository.findBlogById(new mongoose.Types.ObjectId().toString())).rejects.toThrow(
      NotFoundException,
    );
  });
});
