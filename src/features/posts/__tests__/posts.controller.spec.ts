import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';
import { Test, TestingModule } from '@nestjs/testing';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should create a post', async () => {
    const createPostDto: CreatePostDto = { title: 'Test Post', content: 'Test Content' } as CreatePostDto;
    const result: PostEntity = { id: '1', ...createPostDto } as PostEntity;
    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(createPostDto)).toBe(result);
  });

  it('should find all posts', async () => {
    const result: PostEntity[] = [{ id: '1', title: 'Test Post', content: 'Test Content' }] as PostEntity[];
    jest.spyOn(service, 'findAll').mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
  });

  it('should find one post by id', async () => {
    const result: PostEntity = { id: '1', title: 'Test Post', content: 'Test Content' } as PostEntity;
    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    expect(await controller.findOne('1')).toBe(result);
  });

  it('should update a post', async () => {
    const updatePostDto: UpdatePostDto = {
      title: 'Updated Post',
      content: 'Updated Content',
    } as unknown as UpdatePostDto;
    jest.spyOn(service, 'update').mockResolvedValue(undefined);

    expect(await controller.update('1', updatePostDto)).toBeUndefined();
  });

  it('should remove a post', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    expect(await controller.remove('1')).toBeUndefined();
  });
});
