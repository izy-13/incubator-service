import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { dbConnect, dbDisconnect } from '../src/infrastructure';
import { AppModule } from '../src/app.module';

const createPostDto = {
  title: 'New Post',
  content: 'Some content',
  shortDescription: 'Some desc',
};

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  const authHeader = { Authorization: 'Basic ' + Buffer.from('admin:qwerty').toString('base64') };
  const server = (): App => app.getHttpServer() as App;

  beforeAll(async () => {
    // TODO useContainer from class-validator
    await dbConnect();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dbDisconnect();
    await app.close();
  });

  it('should create a post', async () => {
    // const createBlog =
    const response = await request(server())
      .post('/posts')
      .send({ ...createPostDto, blogId: '67b99e384d6144aa499cba88' })
      .set(authHeader);
    console.log(response.body);

    expect(response.body).toHaveProperty('id', expect.any(String));
  });
});
