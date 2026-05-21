import { forwardRef, Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogsQueryRepository, BlogsRepository } from './repositories';
import { PostsModule } from '../posts/posts.module';
import { BlogExistsConstraint } from './decorators/blog-exists.decorator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    forwardRef(() => PostsModule),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsQueryRepository, BlogsRepository, BlogExistsConstraint],
  exports: [BlogsService, BlogExistsConstraint],
})
export class BlogsModule {}
