import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from '../blogs.controller';
import { BlogsService } from '../blogs.service';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogEntity } from '../entities/blog.entity';

describe('BlogsController', () => {
  let controller: BlogsController;
  let service: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [
        {
          provide: BlogsService,
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

    controller = module.get<BlogsController>(BlogsController);
    service = module.get<BlogsService>(BlogsService);
  });

  it('should create a blog', async () => {
    const createBlogDto: CreateBlogDto = { title: 'Test Blog', content: 'Test Content' } as unknown as CreateBlogDto;
    const result: BlogEntity = { id: '1', ...createBlogDto } as BlogEntity;
    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(createBlogDto)).toBe(result);
  });

  it('should find all blogs', async () => {
    const result: BlogEntity[] = [{ id: '1', title: 'Test Blog', content: 'Test Content' }] as unknown as BlogEntity[];
    jest.spyOn(service, 'findAll').mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
  });

  it('should find one blog by id', async () => {
    const result: BlogEntity = { id: '1', title: 'Test Blog', content: 'Test Content' } as unknown as BlogEntity;
    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    expect(await controller.findOne('1')).toBe(result);
  });

  it('should update a blog', async () => {
    const updateBlogDto: UpdateBlogDto = {
      title: 'Updated Blog',
      content: 'Updated Content',
    } as unknown as UpdateBlogDto;
    jest.spyOn(service, 'update').mockResolvedValue(undefined);

    expect(await controller.update('1', updateBlogDto)).toBeUndefined();
  });

  it('should remove a blog', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    expect(await controller.remove('1')).toBeUndefined();
  });
});
