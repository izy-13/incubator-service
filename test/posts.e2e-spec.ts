import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { dbConnect, dbDisconnect } from '../src/coreUtils';
import { AppModule } from '../src/app.module';

// const createBlogDto = {
//   name: 'New Blog',
//   description: 'Some content',
//   websiteUrl: 'www.google.com',
// };

const createPostDto = {
  title: 'New Post',
  content: 'Some content',
  shortDescription: 'Some desc',
};

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  // let blogsService: BlogsService;
  // const connection: mongoose.Connection = mongoose.connection;

  const authHeader = { Authorization: 'Basic ' + Buffer.from('admin:qwerty').toString('base64') };

  // beforeEach(() => {
  //   blogsService = { findOne: jest.fn().mockResolvedValue({ id: 'validId' }) } as unknown as BlogsService;
  //   blogExistsConstraint = new BlogExistsConstraint(blogsService);
  // });

  beforeAll(async () => {
    await dbConnect();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider(BlogExistsConstraint)
      // .useValue({ validate: jest.fn().mockResolvedValue(true) })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dbDisconnect();
    await app.close();
  });

  it('should create a post', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send({ ...createPostDto, blogId: '67b99e384d6144aa499cba88' })
      .set(authHeader);
    console.log(response.body);

    expect(response.body).toHaveProperty('id', expect.any(String));
  });
});
