import { useContainer, validate } from 'class-validator';
import { CreatePostWithBlogIdDto } from '../create-post-with-blogId.dto';
import { BlogExistsConstraint } from '../../../blogs/decorators/blog-exists.decorator';
import { FindBlogUseCase } from '../../../blogs/use-cases';

describe('CreatePostWithBlogIdDto', () => {
  let findBlogUseCase: FindBlogUseCase;
  let blogExistsConstraint: BlogExistsConstraint;

  beforeAll(() => {
    findBlogUseCase = { execute: jest.fn().mockResolvedValue(true) } as unknown as FindBlogUseCase;
    blogExistsConstraint = new BlogExistsConstraint(findBlogUseCase);
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
    const dto = new CreatePostWithBlogIdDto();
    dto.title = 'Valid Title';
    dto.shortDescription = 'Valid Short Description';
    dto.content = 'Valid Content';
    dto.blogId = 'validBlogId';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if title is empty', async () => {
    const dto = new CreatePostWithBlogIdDto();
    dto.title = '';
    dto.shortDescription = 'Valid Short Description';
    dto.content = 'Valid Content';
    dto.blogId = 'validBlogId';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation if shortDescription is empty', async () => {
    const dto = new CreatePostWithBlogIdDto();
    dto.title = 'Valid Title';
    dto.shortDescription = '';
    dto.content = 'Valid Content';
    dto.blogId = 'validBlogId';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('shortDescription');
  });

  it('should fail validation if content is empty', async () => {
    const dto = new CreatePostWithBlogIdDto();
    dto.title = 'Valid Title';
    dto.shortDescription = 'Valid Short Description';
    dto.content = '';
    dto.blogId = 'validBlogId';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('content');
  });

  it('should fail validation if blogId is empty', async () => {
    const dto = new CreatePostWithBlogIdDto();
    dto.title = 'Valid Title';
    dto.shortDescription = 'Valid Short Description';
    dto.content = 'Valid Content';
    dto.blogId = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('blogId');
  });

  it('should trim whitespace from all string properties', async () => {
    const dto = new CreatePostWithBlogIdDto();
    dto.title = '  Valid Title  ';
    dto.shortDescription = '  Valid Short Description  ';
    dto.content = '  Valid Content  ';
    dto.blogId = '  validBlogId  ';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
