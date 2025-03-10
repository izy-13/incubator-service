import { Module } from '@nestjs/common';
import { TestingService } from './testing.service';
import { TestingController } from './testing.controller';
import { BlogsModule } from '../blogs/blogs.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TestingController],
  providers: [TestingService],
  imports: [BlogsModule, PostsModule, UsersModule, AuthModule],
})
export class TestingModule {}
