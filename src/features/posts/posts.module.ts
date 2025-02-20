import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { BasicAuthMiddleware } from '../../middlewares';
import { routesConstants } from '../../coreUtils';
import { BlogsModule } from '../blogs/blogs.module';
import { BlogExistsConstraint } from './validators/blog-exists.validator';
import { MongooseModule } from '@nestjs/mongoose';
import { PostDb, PostSchema } from './schemas/post.schema';
import { PostsQueryRepository, PostsRepository } from './repositories';

const { POSTS } = routesConstants;

@Module({
  controllers: [PostsController],
  providers: [PostsService, BlogExistsConstraint, PostsQueryRepository, PostsRepository],
  exports: [PostsService],
  imports: [MongooseModule.forFeature([{ name: PostDb.name, schema: PostSchema }]), BlogsModule],
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
