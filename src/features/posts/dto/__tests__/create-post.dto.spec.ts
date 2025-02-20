import { useContainer, validate } from 'class-validator';
import { CreatePostDto } from '../create-post.dto';
import { BlogExistsConstraint } from '../../validators/blog-exists.validator';
import { BlogsService } from '../../../blogs/blogs.service';

describe('CreatePostDto', () => {
  let blogsService: BlogsService;
  let blogExistsConstraint: BlogExistsConstraint;

  beforeAll(() => {
    blogsService = { findOne: jest.fn().mockResolvedValue(true) } as unknown as BlogsService;
    blogExistsConstraint = new BlogExistsConstraint(blogsService);
    jest.spyOn(blogExistsConstraint, 'validate').mockImplementation(() => Promise.resolve(true));
    useContainer({
      get: (someClass: any) => {
        if (someClass === BlogExistsConstraint) {
          return blogExistsConstraint;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
        return new someClass();
      },
    });
  });

  it('should validate successfully with valid data', async () => {
    const dto = new CreatePostDto();
    dto.title = 'Valid Title';
    dto.shortDescription = 'Valid Short Description';
    dto.content = 'Valid Content';
    dto.blogId = 'validBlogId';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if title is empty', async () => {
    const dto = new CreatePostDto();
    dto.title = '';
    dto.shortDescription = 'Valid Short Description';
    dto.content = 'Valid Content';
    dto.blogId = 'validBlogId';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation if shortDescription is empty', async () => {
    const dto = new CreatePostDto();
    dto.title = 'Valid Title';
    dto.shortDescription = '';
    dto.content = 'Valid Content';
    dto.blogId = 'validBlogId';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('shortDescription');
  });

  it('should fail validation if content is empty', async () => {
    const dto = new CreatePostDto();
    dto.title = 'Valid Title';
    dto.shortDescription = 'Valid Short Description';
    dto.content = '';
    dto.blogId = 'validBlogId';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('content');
  });

  it('should fail validation if blogId is empty', async () => {
    const dto = new CreatePostDto();
    dto.title = 'Valid Title';
    dto.shortDescription = 'Valid Short Description';
    dto.content = 'Valid Content';
    dto.blogId = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('blogId');
  });

  it('should trim whitespace from all string properties', async () => {
    const dto = new CreatePostDto();
    dto.title = '  Valid Title  ';
    dto.shortDescription = '  Valid Short Description  ';
    dto.content = '  Valid Content  ';
    dto.blogId = '  validBlogId  ';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
