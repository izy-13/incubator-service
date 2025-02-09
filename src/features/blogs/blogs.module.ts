import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { routesConstants } from '../../coreUtils';
import { BasicAuthMiddleware } from '../../middlewares';

const { BLOGS } = routesConstants;

@Module({
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BasicAuthMiddleware)
      .forRoutes(
        { path: BLOGS, method: RequestMethod.POST },
        { path: `${BLOGS}/:id`, method: RequestMethod.DELETE },
        { path: `${BLOGS}/:id`, method: RequestMethod.PUT },
      );
  }
}
