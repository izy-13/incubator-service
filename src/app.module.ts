import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  BlogsModule,
  CommentsModule,
  PostsModule,
  RequestLoggerMiddleware,
  RequestLogModule,
  TestingModule,
  UsersModule,
} from './features';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        // TODO mb another cluster for vercel
        const isTestEnv = process.env.NODE_ENV === 'test';
        return { uri: `mongodb://${process.env.MONGO_DB_PORT}/${isTestEnv ? 'nestTest' : 'nest'}` };
      },
    }),
    PostsModule,
    BlogsModule,
    UsersModule,
    TestingModule,
    CommentsModule,
    RequestLogModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
