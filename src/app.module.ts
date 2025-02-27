import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule, PostsModule, TestingModule, UsersModule } from './features';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || `mongodb://${process.env.MONGO_DB_PORT}/nest`),
    PostsModule,
    BlogsModule,
    TestingModule,
    UsersModule,
  ],
})
export class AppModule {}
