import { PostsQueryRepository, PostsRepository } from '../repositories';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';
import { NotFoundException } from '@nestjs/common';
import { CreatePostWithBlogIdDto } from '../dto/create-post-with-blogId.dto';
import { PaginatedResponse } from '../../../common';
import {
  ClearPostsUseCase,
  CreatePostUseCase,
  DeletePostUseCase,
  FindAllPostsUseCase,
  FindPostUseCase,
  UpdatePostUseCase,
} from '../use-cases';
import { ClearCommentsUseCase } from '../../comments/use-cases';

describe('PostsUseCases', () => {
  let queryRepository: PostsQueryRepository;
  let repository: PostsRepository;
  let clearCommentsUseCase: ClearCommentsUseCase;

  beforeEach(() => {
    queryRepository = {
      findAllPosts: jest.fn(),
      findPostById: jest.fn(),
    } as unknown as PostsQueryRepository;
    clearCommentsUseCase = { execute: jest.fn() } as unknown as ClearCommentsUseCase;
    repository = {
      createPost: jest.fn(),
      updatePost: jest.fn(),
      deletePost: jest.fn(),
      deleteAllPosts: jest.fn(),
    } as unknown as PostsRepository;
  });

  it('should create a post', async () => {
    const useCase = new CreatePostUseCase(repository);
    const createPostDto = {
      title: 'Test Post',
      content: 'Test Content',
    } as CreatePostWithBlogIdDto;
    const result: PostEntity = { id: '1', ...createPostDto } as PostEntity;
    jest.spyOn(repository, 'createPost').mockResolvedValue(result);

    expect(await useCase.execute(createPostDto)).toBe(result);
  });

  it('should find all posts', async () => {
    const useCase = new FindAllPostsUseCase(queryRepository);
    const result = {
      items: [{ id: '1', title: 'Test Post', content: 'Test Content' }],
    } as PaginatedResponse<PostEntity>;
    jest.spyOn(queryRepository, 'findAllPosts').mockResolvedValue(result);

    expect(await useCase.execute({} as any)).toBe(result);
  });

  it('should find one post by id', async () => {
    const useCase = new FindPostUseCase(queryRepository);
    const result: PostEntity = {
      id: '1',
      title: 'Test Post',
      content: 'Test Content',
    } as PostEntity;
    jest.spyOn(queryRepository, 'findPostById').mockResolvedValue(result);

    expect(await useCase.execute('1')).toBe(result);
  });

  it('should update a post', async () => {
    const useCase = new UpdatePostUseCase(repository);
    const updatePostDto: UpdatePostDto = {
      title: 'Updated Post',
      content: 'Updated Content',
    } as UpdatePostDto;
    jest.spyOn(repository, 'updatePost').mockResolvedValue(undefined);

    expect(await useCase.execute('1', updatePostDto)).toBeUndefined();
  });

  it('should remove a post', async () => {
    const useCase = new DeletePostUseCase(repository);
    jest.spyOn(repository, 'deletePost').mockResolvedValue(undefined);

    expect(await useCase.execute('1')).toBeUndefined();
  });

  it('should clear all posts', async () => {
    const useCase = new ClearPostsUseCase(repository, clearCommentsUseCase);
    jest.spyOn(repository, 'deleteAllPosts').mockResolvedValue(undefined as any);

    expect(await useCase.execute()).toBeUndefined();
  });

  it('should throw NotFoundException if post not found', async () => {
    const useCase = new FindPostUseCase(queryRepository);
    jest.spyOn(queryRepository, 'findPostById').mockRejectedValue(new NotFoundException());

    await expect(useCase.execute('invalidId')).rejects.toThrow(NotFoundException);
  });
});
