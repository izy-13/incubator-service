import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import mongoose from 'mongoose';
import { dbConnect, dbDisconnect } from '../src/coreUtils';
import { BlogEntity } from '../src/features/blogs/entities/blog.entity';
import { AppModule } from '../src/app.module';

const createBlogDto = {
  name: 'New Blog',
  description: 'Some content',
  websiteUrl: 'www.google.com',
};

describe('BlogsController (e2e)', () => {
  let app: INestApplication;
  const authHeader = { Authorization: 'Basic ' + Buffer.from('admin:qwerty').toString('base64') };

  beforeAll(async () => {
    const { uri } = await dbConnect();
    // env.MONGO_URI = '123';

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

  it('should create a blog', async () => {
    const response = await request(app.getHttpServer())
      .post('/blogs')
      .send(createBlogDto)
      .set(authHeader)
      .expect(HttpStatus.CREATED);

    expect(response.body).toMatchObject({
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
    });
  });

  it('should return all blogs', async () => {
    const response = await request(app.getHttpServer()).get('/blogs').expect(HttpStatus.OK);

    expect(response.body?.items).toBeInstanceOf(Array);
  });

  it('should return a blog by id', async () => {
    const createResponse = await request(app.getHttpServer()).post('/blogs').send(createBlogDto).set(authHeader);

    const blogId: string = (createResponse.body as BlogEntity).id;

    const response = await request(app.getHttpServer()).get(`/blogs/${blogId}`).expect(HttpStatus.OK);
    expect(response.body).toHaveProperty('id', blogId);
  });

  it('should update a blog', async () => {
    const createResponse = await request(app.getHttpServer()).post('/blogs').send(createBlogDto).set(authHeader);

    const blogId: string = (createResponse.body as BlogEntity).id;

    const updateBlogDto = {
      name: 'Updated Blog',
      description: 'Updated Content',
      websiteUrl: 'www.youtube.com',
    };

    await request(app.getHttpServer())
      .put(`/blogs/${blogId}`)
      .set(authHeader)
      .send(updateBlogDto)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('should delete a blog', async () => {
    const createResponse = await request(app.getHttpServer()).post('/blogs').send(createBlogDto).set(authHeader);

    const blogId: string = (createResponse.body as BlogEntity).id;

    await request(app.getHttpServer()).delete(`/blogs/${blogId}`).set(authHeader).expect(HttpStatus.NO_CONTENT);
  });

  it('should return 404 for non-existing blog', async () => {
    const nonExistingId = new mongoose.Types.ObjectId().toString();

    await request(app.getHttpServer()).get(`/blogs/${nonExistingId}`).expect(HttpStatus.NOT_FOUND);
  });

  it('should return 404 for non-existing blog', async () => {
    const nonExistingId = new mongoose.Types.ObjectId().toString();

    await request(app.getHttpServer()).get(`/blogs/${nonExistingId}`).expect(HttpStatus.NOT_FOUND);
  });
});
