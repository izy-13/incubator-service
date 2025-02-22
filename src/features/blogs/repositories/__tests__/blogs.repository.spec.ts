import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BlogsRepository } from '../blogs.repository';
import { Blog } from '../../schemas/blog.schema';
import { NotFoundException } from '@nestjs/common';
import { dbConnect, dbDisconnect } from '../../../../coreUtils';
import { CreateBlogDto } from '../../dto/create-blog.dto';
import { UpdateBlogDto } from '../../dto/update-blog.dto';

describe('BlogsRepository', () => {
  let blogsRepository: BlogsRepository;
  let blogModel: Model<Blog>;

  const connection: mongoose.Connection = mongoose.connection;

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
      providers: [BlogsRepository, { provide: getModelToken(Blog.name), useValue: blogModel }],
    }).compile();

    blogsRepository = module.get<BlogsRepository>(BlogsRepository);
  });

  afterAll(async () => {
    await dbDisconnect();
  });

  beforeEach(async () => {
    await blogModel.deleteMany({});
  });

  it('should create a blog', async () => {
    const createBlogDto: CreateBlogDto = {
      name: 'New Blog',
      description: 'A description',
      websiteUrl: 'https://example.com',
      isMembership: false,
    };

    const blog = await blogsRepository.createBlog(createBlogDto);
    expect(blog).toMatchObject({
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
      isMembership: createBlogDto.isMembership,
    });
  });

  it('should update a blog', async () => {
    const blog = await blogModel.create({
      name: 'Old Blog',
      description: 'Old description',
      websiteUrl: 'https://old.com',
      isMembership: false,
      createdAt: new Date(),
    });

    const updateDto: UpdateBlogDto = { name: 'Updated Blog' } as UpdateBlogDto;
    await blogsRepository.updateBlog(blog._id.toString(), updateDto);

    const updatedBlog = await blogModel.findById(blog._id).lean();
    expect(updatedBlog?.name).toBe(updateDto.name);
  });

  it('should throw NotFoundException when updating a non-existing blog', async () => {
    await expect(
      blogsRepository.updateBlog(new mongoose.Types.ObjectId().toString(), { name: 'New Name' } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a blog', async () => {
    const blog = await blogModel.create({
      name: 'Delete Me',
      description: 'To be deleted',
      websiteUrl: 'https://delete.com',
      isMembership: false,
      createdAt: new Date(),
    });

    await blogsRepository.deleteBlog(blog._id.toString());
    const deletedBlog = await blogModel.findById(blog._id);
    expect(deletedBlog).toBeNull();
  });

  it('should throw NotFoundException when deleting a non-existing blog', async () => {
    await expect(blogsRepository.deleteBlog(new mongoose.Types.ObjectId().toString())).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete all blogs', async () => {
    await blogModel.create([
      {
        name: 'Blog 1',
        description: 'Desc 1',
        websiteUrl: 'https://blog1.com',
        isMembership: false,
        createdAt: new Date(),
      },
      {
        name: 'Blog 2',
        description: 'Desc 2',
        websiteUrl: 'https://blog2.com',
        isMembership: false,
        createdAt: new Date(),
      },
    ]);

    await blogsRepository.deleteAllBlogs();
    const remainingBlogs = await blogModel.find();
    expect(remainingBlogs).toHaveLength(0);
  });
});
