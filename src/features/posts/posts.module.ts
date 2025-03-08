import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { BasicAuthMiddleware } from '../../middlewares';
import { routesConstants } from '../../coreUtils';
import { BlogsModule } from '../blogs/blogs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostDb, PostSchema } from './schemas/post.schema';
import { PostsQueryRepository, PostsRepository } from './repositories';
import { BlogExistsConstraint } from '../../decorators';
import { CommentsModule } from '../comments/comments.module';

const { POSTS } = routesConstants;

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsQueryRepository, PostsRepository, BlogExistsConstraint],
  exports: [PostsService],
  imports: [
    MongooseModule.forFeature([{ name: PostDb.name, schema: PostSchema }]),
    forwardRef(() => BlogsModule),
    CommentsModule,
  ],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BasicAuthMiddleware)
      .forRoutes(
        { path: POSTS, method: RequestMethod.POST },
        { path: `${POSTS}/:id`, method: RequestMethod.DELETE },
        { path: `${POSTS}/:id`, method: RequestMethod.PUT },
      );
  }
}
