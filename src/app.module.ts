import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, BlogsModule, CommentsModule, PostsModule, TestingModule, UsersModule } from './features';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const isTestEnv = process.env.NODE_ENV === 'test';
        return { uri: `mongodb://${process.env.MONGO_DB_PORT}/${isTestEnv ? 'nestTest' : 'nest'}` };
      },
    }),
    PostsModule,
    BlogsModule,
    UsersModule,
    AuthModule,
    TestingModule,
    CommentsModule,
  ],
})
export class AppModule {}
