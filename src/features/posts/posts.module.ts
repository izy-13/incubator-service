import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { BlogsModule } from '../blogs/blogs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostDb, PostSchema } from './schemas/post.schema';
import { PostsQueryRepository, PostsRepository } from './repositories';
import { CommentsModule } from '../comments/comments.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsQueryRepository, PostsRepository],
  exports: [PostsService],
  imports: [
    MongooseModule.forFeature([{ name: PostDb.name, schema: PostSchema }]),
    forwardRef(() => BlogsModule),
    CommentsModule,
  ],
})
export class PostsModule {}
