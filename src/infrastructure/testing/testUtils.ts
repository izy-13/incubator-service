import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Type } from '@nestjs/common';
import { AppModule } from '../../app.module';

export const initE2eApp = async (ModuleClass: Type<AppModule>): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [ModuleClass],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
};

export const closeE2eApp = async (app: INestApplication) => {
  await app.close();
};
