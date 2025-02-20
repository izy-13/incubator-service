import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { transformValidationFactory } from '../../../coreUtils';
import { AppModule } from '../../../app.module';

describe('BlogsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/blogs (PUT) should throw a BadRequestException for invalid body', async () => {
    const update = {
      nam: 'somename',
      websiteUrl: 'invalid-url',
      description: 'description',
    };

    const response = await request(app.getHttpServer())
      .put('/blogs/11')
      .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
      .send(update)
      .expect(400);

    expect(response.body).toEqual({
      errorsMessages: [
        { message: 'invalid value', field: 'name' },
        { message: 'invalid value', field: 'websiteUrl' },
      ],
    });
  });
});
