import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('TestingController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should remove all data and return no content status', async () => {
    await request(app.getHttpServer()).delete('/testing/all-data').expect(HttpStatus.NO_CONTENT);
  });

  it('should return 404 for non-existing route', async () => {
    await request(app.getHttpServer()).delete('/testing/non-existing-route').expect(HttpStatus.NOT_FOUND);
  });
});
