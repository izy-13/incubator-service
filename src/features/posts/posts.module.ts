import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { BasicAuthMiddleware } from '../../middlewares';
import { routesConstants } from '../../coreUtils';
import { BlogsModule } from '../blogs/blogs.module';
import { BlogExistsConstraint } from './validators/blog-exists.validator';

const { POSTS } = routesConstants;

@Module({
  controllers: [PostsController],
  providers: [PostsService, BlogExistsConstraint],
  exports: [PostsService],
  imports: [BlogsModule],
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
