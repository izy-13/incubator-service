import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule, PostsModule, TestingModule } from './features';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_DB_PORT}/nest`),
    PostsModule,
    BlogsModule,
    TestingModule,
  ],
})
export class AppModule {}
