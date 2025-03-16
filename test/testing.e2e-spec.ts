import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { closeE2eApp, initE2eApp } from '../src/coreUtils';
import { AppModule } from '../src/app.module';

describe('TestingController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initE2eApp(AppModule);
  });

  afterAll(async () => {
    await closeE2eApp(app);
  });

  it('should remove all data and return no content status', async () => {
    await request(app.getHttpServer()).delete('/testing/all-data').expect(HttpStatus.NO_CONTENT);
  });

  it('should return 404 for non-existing route', async () => {
    await request(app.getHttpServer()).delete('/testing/non-existing-route').expect(HttpStatus.NOT_FOUND);
  });
});
