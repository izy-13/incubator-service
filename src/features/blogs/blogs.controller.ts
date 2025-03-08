import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { routesConstants, transformValidationFactory } from '../../coreUtils';
import { BlogEntity } from './entities/blog.entity';
import { ObjectIdValidationPipe } from '../../pipes';
import { FindAllBlogsQueryDto } from './dto/find-all-blogs-query.dto';
import { PaginatedResponse } from '../../types';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { PostEntity } from '../posts/entities/post.entity';
import { FindAllPostsQueryDto } from '../posts/dto/find-all-posts-query.dto';
import { PublicApi } from '../../decorators';

const { BLOGS, POSTS } = routesConstants;

@Controller(BLOGS)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @PublicApi()
  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBlogDto: CreateBlogDto): Promise<BlogEntity | void> {
    return this.blogsService.create(createBlogDto);
  }

  @PublicApi()
  @Get()
  findAll(@Query() queryParams: FindAllBlogsQueryDto): Promise<PaginatedResponse<BlogEntity>> {
    return this.blogsService.findAll(queryParams);
  }

  // TODO can be refactoed by directly get data from repo (DAL)
  @PublicApi()
  @Get(':id')
  findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<BlogEntity> {
    return this.blogsService.findOne(id);
  }

  @PublicApi()
  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id', ObjectIdValidationPipe) id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @PublicApi()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.blogsService.remove(id);
  }

  @PublicApi()
  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @Post(`:blogId/${POSTS}`)
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @Param('blogId', ObjectIdValidationPipe) blogId: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return this.blogsService.createPost(blogId, createPostDto);
  }

  @PublicApi()
  @Get(`:blogId/${POSTS}`)
  findAllPosts(
    @Param('blogId', ObjectIdValidationPipe) blogId: string,
    @Query() queryParams: FindAllPostsQueryDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    return this.blogsService.findAllPosts(blogId, queryParams);
  }
}
