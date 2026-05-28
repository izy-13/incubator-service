import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  BasicAuthGuard,
  ObjectIdValidationPipe,
  PaginatedResponse,
  PublicApi,
  ResultNotification,
  routesConstants,
} from '../../common';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { FindAllPostsQueryDto } from '../posts/dto/find-all-posts-query.dto';
import { PostEntity } from '../posts/entities/post.entity';
import { CreateBlogPostUseCase, FindBlogPostsUseCase } from './use-cases';

const { BLOGS, POSTS } = routesConstants;

@Controller(BLOGS)
export class BlogPostsController {
  constructor(
    private readonly createBlogPostUseCase: CreateBlogPostUseCase,
    private readonly findBlogPostsUseCase: FindBlogPostsUseCase,
  ) {}

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @Post(`:blogId/${POSTS}`)
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @Param('blogId', ObjectIdValidationPipe) blogId: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return this.createBlogPostUseCase.execute(blogId, createPostDto);
  }

  @PublicApi()
  @Get(`:blogId/${POSTS}`)
  findAllPosts(
    @Param('blogId', ObjectIdValidationPipe) blogId: string,
    @Query() queryParams: FindAllPostsQueryDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    return this.findBlogPostsUseCase.execute(blogId, queryParams);
  }
}
