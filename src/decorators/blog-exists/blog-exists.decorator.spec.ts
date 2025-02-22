import { BlogExistsConstraint } from './blog-exists.decorator';
import { BlogsService } from '../../features/blogs/blogs.service';
import { NotFoundException } from '@nestjs/common';

describe('BlogExistsConstraint', () => {
  let blogsService: BlogsService;
  let blogExistsConstraint: BlogExistsConstraint;

  beforeEach(() => {
    blogsService = { findOne: jest.fn() } as unknown as BlogsService;
    blogExistsConstraint = new BlogExistsConstraint(blogsService);
  });

  it('should return true if blog exists', async () => {
    (blogsService.findOne as jest.Mock).mockResolvedValue({ id: 'validId' });
    await expect(blogExistsConstraint.validate('validId')).resolves.toBe(true);
  });

  it('should return false if blog does not exist', async () => {
    (blogsService.findOne as jest.Mock).mockResolvedValue(null);
    await expect(blogExistsConstraint.validate('invalidId')).resolves.toBe(false);
  });

  it('should throw an error if blogsService.findOne throws an error', async () => {
    (blogsService.findOne as jest.Mock).mockRejectedValue(new NotFoundException());
    await expect(blogExistsConstraint.validate('errorId')).resolves.toBe(false);
  });

  it('should return the correct default message', () => {
    expect(blogExistsConstraint.defaultMessage()).toBe('Blog with ID $value not found');
  });
});
