import { Module } from '@nestjs/common';
import { TestingService } from './testing.service';
import { TestingController } from './testing.controller';
import { BlogsModule } from '../blogs/blogs.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [TestingController],
  providers: [TestingService],
  imports: [BlogsModule, PostsModule, UsersModule],
})
export class TestingModule {}
