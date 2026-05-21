import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AuthModule,
  BlogsModule,
  CommentsModule,
  DeviceSecurityModule,
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
        const isTestEnv = process.env.NODE_ENV === 'test';
        const uri = process.env.MONGO_URI ?? `mongodb://${process.env.MONGO_DB_PORT}/nest`;
        return { uri: isTestEnv ? `mongodb://${process.env.MONGO_DB_PORT}/nestTest` : uri };
      },
    }),
    PostsModule,
    BlogsModule,
    UsersModule,
    TestingModule,
    CommentsModule,
    RequestLogModule,
    AuthModule,
    DeviceSecurityModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
