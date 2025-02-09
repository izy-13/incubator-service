import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Running at localhost:${port}`);
}

bootstrap();
