import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { routesConstants } from '../../coreUtils';
import { BasicAuthMiddleware } from '../../middlewares';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';

const { BLOGS } = routesConstants;

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
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
