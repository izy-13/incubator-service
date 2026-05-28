import { PostsController } from '../posts.controller';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostWithBlogIdDto } from '../dto/create-post-with-blogId.dto';
import { PaginatedResponse } from '../../../common';
import {
  CreatePostCommentUseCase,
  CreatePostUseCase,
  DeletePostUseCase,
  FindAllPostsUseCase,
  FindPostCommentsUseCase,
  FindPostUseCase,
  UpdatePostUseCase,
} from '../use-cases';

describe('PostsController', () => {
  let controller: PostsController;
  let createPostUseCase: CreatePostUseCase;
  let findAllPostsUseCase: FindAllPostsUseCase;
  let findPostUseCase: FindPostUseCase;
  let updatePostUseCase: UpdatePostUseCase;
  let deletePostUseCase: DeletePostUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        { provide: CreatePostUseCase, useValue: { execute: jest.fn() } },
        { provide: FindAllPostsUseCase, useValue: { execute: jest.fn() } },
        { provide: FindPostUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdatePostUseCase, useValue: { execute: jest.fn() } },
        { provide: DeletePostUseCase, useValue: { execute: jest.fn() } },
        { provide: FindPostCommentsUseCase, useValue: { execute: jest.fn() } },
        { provide: CreatePostCommentUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    createPostUseCase = module.get<CreatePostUseCase>(CreatePostUseCase);
    findAllPostsUseCase = module.get<FindAllPostsUseCase>(FindAllPostsUseCase);
    findPostUseCase = module.get<FindPostUseCase>(FindPostUseCase);
    updatePostUseCase = module.get<UpdatePostUseCase>(UpdatePostUseCase);
    deletePostUseCase = module.get<DeletePostUseCase>(DeletePostUseCase);
  });

  it('should create a post', async () => {
    const createPostDto: CreatePostWithBlogIdDto = {
      title: 'Test Post',
      content: 'Test Content',
    } as CreatePostWithBlogIdDto;
    const result: PostEntity = { id: '1', ...createPostDto } as PostEntity;
    jest.spyOn(createPostUseCase, 'execute').mockResolvedValue(result);

    expect(await controller.create(createPostDto)).toBe(result);
  });

  it('should find all posts', async () => {
    const result = {
      items: [{ id: '1', title: 'Test Post', content: 'Test Content' }],
    } as PaginatedResponse<PostEntity>;
    jest.spyOn(findAllPostsUseCase, 'execute').mockResolvedValue(result);

    expect(await controller.findAll({} as any)).toBe(result);
  });

  it('should find one post by id', async () => {
    const result: PostEntity = {
      id: '1',
      title: 'Test Post',
      content: 'Test Content',
    } as PostEntity;
    jest.spyOn(findPostUseCase, 'execute').mockResolvedValue(result);

    expect(await controller.findOne('1')).toBe(result);
  });

  it('should update a post', async () => {
    const updatePostDto: UpdatePostDto = {
      title: 'Updated Post',
      content: 'Updated Content',
    } as unknown as UpdatePostDto;
    jest.spyOn(updatePostUseCase, 'execute').mockResolvedValue(undefined);

    expect(await controller.update('1', updatePostDto)).toBeUndefined();
  });

  it('should remove a post', async () => {
    jest.spyOn(deletePostUseCase, 'execute').mockResolvedValue(undefined);

    expect(await controller.remove('1')).toBeUndefined();
  });
});
