import { validate } from 'class-validator';
import { CreateBlogDto } from '../create-blog.dto';

describe('CreateBlogDto', () => {
  it('should validate successfully with valid data', async () => {
    const dto = new CreateBlogDto();
    dto.name = 'Valid Name';
    dto.description = 'Valid Description';
    dto.websiteUrl = 'https://validurl.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if name is empty', async () => {
    const dto = new CreateBlogDto();
    dto.name = '';
    dto.description = 'Valid Description';
    dto.websiteUrl = 'https://validurl.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation if description is empty', async () => {
    const dto = new CreateBlogDto();
    dto.name = 'Valid Name';
    dto.description = '';
    dto.websiteUrl = 'https://validurl.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should fail validation if websiteUrl is empty', async () => {
    const dto = new CreateBlogDto();
    dto.name = 'Valid Name';
    dto.description = 'Valid Description';
    dto.websiteUrl = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('websiteUrl');
  });

  it('should fail validation if websiteUrl is not a valid URL', async () => {
    const dto = new CreateBlogDto();
    dto.name = 'Valid Name';
    dto.description = 'Valid Description';
    dto.websiteUrl = 'invalid-url';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('websiteUrl');
  });

  it('should trim whitespace from all string properties', async () => {
    const dto = new CreateBlogDto();
    dto.name = '  Valid Name  ';
    dto.description = '  Valid Description  ';
    dto.websiteUrl = 'www.validurl.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
