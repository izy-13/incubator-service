import { forwardRef, Module } from '@nestjs/common';
import { BlogPostsController } from './blog-posts.controller';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogsQueryRepository, BlogsRepository } from './repositories';
import { PostsModule } from '../posts/posts.module';
import { BlogExistsConstraint } from './decorators/blog-exists.decorator';
import { BlogsUseCases } from './use-cases';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    forwardRef(() => PostsModule),
  ],
  controllers: [BlogsController, BlogPostsController],
  providers: [...BlogsUseCases, BlogsQueryRepository, BlogsRepository, BlogExistsConstraint],
  exports: [...BlogsUseCases, BlogExistsConstraint],
})
export class BlogsModule {}
