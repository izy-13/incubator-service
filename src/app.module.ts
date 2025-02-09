import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule, PostsModule, TestingModule } from './features';

@Module({
  imports: [ConfigModule.forRoot(), PostsModule, BlogsModule, TestingModule],
})
export class AppModule {}
