import { PostsService } from '../posts.service';
import { PostsQueryRepository, PostsRepository } from '../repositories';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';
import { NotFoundException } from '@nestjs/common';
import { CreatePostWithBlogIdDto } from '../dto/create-post-with-blogId.dto';
import { PaginatedResponse } from '../../../types';

describe('PostsService', () => {
  let service: PostsService;
  let queryRepository: PostsQueryRepository;
  let repository: PostsRepository;

  beforeEach(() => {
    queryRepository = { findAllPosts: jest.fn(), findPostById: jest.fn() } as unknown as PostsQueryRepository;
    repository = {
      createPost: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
      deleteAllPosts: jest.fn(),
    } as unknown as PostsRepository;
    service = new PostsService(queryRepository, repository);
  });

  it('should create a post', async () => {
    const createPostDto = { title: 'Test Post', content: 'Test Content' } as CreatePostWithBlogIdDto;
    const result: PostEntity = { id: '1', ...createPostDto } as PostEntity;
    jest.spyOn(repository, 'createPost').mockResolvedValue(result);

    expect(await service.create(createPostDto)).toBe(result);
  });

  it('should find all posts', async () => {
    const result = {
      items: [{ id: '1', title: 'Test Post', content: 'Test Content' }],
    } as PaginatedResponse<PostEntity>;
    jest.spyOn(queryRepository, 'findAllPosts').mockResolvedValue(result);

    expect(await service.findAll({} as any)).toBe(result);
  });

  it('should find one post by id', async () => {
    const result: PostEntity = { id: '1', title: 'Test Post', content: 'Test Content' } as PostEntity;
    jest.spyOn(queryRepository, 'findPostById').mockResolvedValue(result);

    expect(await service.findOne('1')).toBe(result);
  });

  it('should update a post', async () => {
    const updatePostDto: UpdatePostDto = { title: 'Updated Post', content: 'Updated Content' } as UpdatePostDto;
    jest.spyOn(repository, 'updatePost').mockResolvedValue(undefined);

    expect(await service.update('1', updatePostDto)).toBeUndefined();
  });

  it('should remove a post', async () => {
    jest.spyOn(repository, 'deletePost').mockResolvedValue(undefined);

    expect(await service.remove('1')).toBeUndefined();
  });

  it('should clear all posts', async () => {
    jest.spyOn(repository, 'deleteAllPosts').mockResolvedValue(undefined as any);

    expect(await service.clearAll()).toBeUndefined();
  });

  it('should throw NotFoundException if post not found', async () => {
    jest.spyOn(queryRepository, 'findPostById').mockRejectedValue(new NotFoundException());

    await expect(service.findOne('invalidId')).rejects.toThrow(NotFoundException);
  });
});
