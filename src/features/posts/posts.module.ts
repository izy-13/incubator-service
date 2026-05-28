import { forwardRef, Module } from '@nestjs/common';
import { PostCommentsController } from './post-comments.controller';
import { PostsController } from './posts.controller';
import { BlogsModule } from '../blogs/blogs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostDb, PostSchema } from './schemas/post.schema';
import { PostsQueryRepository, PostsRepository } from './repositories';
import { CommentsModule } from '../comments/comments.module';
import { PostsUseCases } from './use-cases';

@Module({
  controllers: [PostsController, PostCommentsController],
  providers: [...PostsUseCases, PostsQueryRepository, PostsRepository],
  exports: [...PostsUseCases],
  imports: [
    MongooseModule.forFeature([{ name: PostDb.name, schema: PostSchema }]),
    forwardRef(() => BlogsModule),
    CommentsModule,
  ],
})
export class PostsModule {}
