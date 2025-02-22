import { BlogsService } from '../blogs.service';
import { BlogsQueryRepository, BlogsRepository } from '../repositories';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogEntity } from '../entities/blog.entity';
import { NotFoundException } from '@nestjs/common';

describe('BlogsService', () => {
  let service: BlogsService;
  let queryRepository: BlogsQueryRepository;
  let repository: BlogsRepository;

  beforeEach(() => {
    queryRepository = { findAllBlogs: jest.fn(), findBlogById: jest.fn() } as unknown as BlogsQueryRepository;
    repository = {
      createBlog: jest.fn(),
      updateBlog: jest.fn(),
      deleteBlog: jest.fn(),
      deleteAllBlogs: jest.fn(),
    } as unknown as BlogsRepository;
    service = new BlogsService(null as any, queryRepository, repository);
  });

  it('should create a blog', async () => {
    const createBlogDto: CreateBlogDto = { title: 'Test Blog', content: 'Test Content' } as unknown as CreateBlogDto;
    const result: BlogEntity = { id: '1', ...createBlogDto } as BlogEntity;
    jest.spyOn(repository, 'createBlog').mockResolvedValue(result);

    expect(await service.create(createBlogDto)).toBe(result);
  });

  it('should find all blogs', async () => {
    const result: BlogEntity[] = [{ id: '1', title: 'Test Blog', content: 'Test Content' }] as unknown as BlogEntity[];
    jest.spyOn(queryRepository, 'findAllBlogs').mockResolvedValue(result);

    expect(await service.findAll()).toBe(result);
  });

  it('should find one blog by id', async () => {
    const result: BlogEntity = { id: '1', title: 'Test Blog', content: 'Test Content' } as unknown as BlogEntity;
    jest.spyOn(queryRepository, 'findBlogById').mockResolvedValue(result);

    expect(await service.findOne('1')).toBe(result);
  });

  it('should update a blog', async () => {
    const updateBlogDto: UpdateBlogDto = {
      title: 'Updated Blog',
      content: 'Updated Content',
    } as unknown as UpdateBlogDto;
    jest.spyOn(repository, 'updateBlog').mockResolvedValue(undefined);

    expect(await service.update('1', updateBlogDto)).toBeUndefined();
  });

  it('should remove a blog', async () => {
    jest.spyOn(repository, 'deleteBlog').mockResolvedValue(undefined);

    expect(await service.remove('1')).toBeUndefined();
  });

  it('should clear all blogs', async () => {
    jest.spyOn(repository, 'deleteAllBlogs').mockResolvedValue(undefined as any);

    expect(await service.clearAll()).toBeUndefined();
  });

  it('should throw NotFoundException if blog not found', async () => {
    jest.spyOn(queryRepository, 'findBlogById').mockRejectedValue(new NotFoundException());

    await expect(service.findOne('invalidId')).rejects.toThrow(NotFoundException);
  });
});
