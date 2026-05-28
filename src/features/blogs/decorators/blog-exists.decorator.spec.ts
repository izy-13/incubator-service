import { BlogExistsConstraint } from './blog-exists.decorator';
import { FindBlogUseCase } from '../use-cases';
import { NotFoundException } from '@nestjs/common';

describe('BlogExistsConstraint', () => {
  let findBlogUseCase: FindBlogUseCase;
  let blogExistsConstraint: BlogExistsConstraint;

  beforeEach(() => {
    findBlogUseCase = { execute: jest.fn() } as unknown as FindBlogUseCase;
    blogExistsConstraint = new BlogExistsConstraint(findBlogUseCase);
  });

  it('should return true if blog exists', async () => {
    (findBlogUseCase.execute as jest.Mock).mockResolvedValue({ id: 'validId' });
    await expect(blogExistsConstraint.validate('validId')).resolves.toBe(true);
  });

  it('should return false if blog does not exist', async () => {
    (findBlogUseCase.execute as jest.Mock).mockResolvedValue(null);
    await expect(blogExistsConstraint.validate('invalidId')).resolves.toBe(false);
  });

  it('should throw an error if findBlogUseCase.execute throws an error', async () => {
    (findBlogUseCase.execute as jest.Mock).mockRejectedValue(new NotFoundException());
    await expect(blogExistsConstraint.validate('errorId')).resolves.toBe(false);
  });

  it('should return the correct default message', () => {
    expect(blogExistsConstraint.defaultMessage()).toBe('Blog with ID $value not found');
  });
});
