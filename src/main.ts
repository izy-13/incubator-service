import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { IncomingMessage, ServerResponse } from 'http';

const expressServer = express();
let cachedApp: NestExpressApplication;

async function createApp(): Promise<NestExpressApplication> {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressServer),
  );
  app.set('trust proxy', 1);
  app.enableCors();
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('incubator project')
    .setDescription('The incubator API description')
    .setVersion('1.0')
    .addTag('incubator')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.init();
  cachedApp = app;
  return app;
}

if (process.env.VERCEL !== '1') {
  createApp().then((app) => {
    const port = process.env.PORT ?? 3000;
    app.listen(port);
    console.log(`Running at localhost:${port}`);
  });
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  await createApp();
  expressServer(req, res);
};
