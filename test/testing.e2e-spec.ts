import { Test, TestingModule as TestingModuleNest } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { dbConnect, dbDisconnect } from '../src/coreUtils';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from '../src/features/testing/testing.module';

describe('TestingController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { uri } = await dbConnect();

    const moduleFixture: TestingModuleNest = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), TestingModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dbDisconnect();

    await app.close();
  });

  it('should remove all data and return no content status', async () => {
    await request(app.getHttpServer()).delete('/testing/all-data').expect(HttpStatus.NO_CONTENT);
  });

  it('should return 404 for non-existing route', async () => {
    await request(app.getHttpServer()).delete('/testing/non-existing-route').expect(HttpStatus.NOT_FOUND);
  });
});
