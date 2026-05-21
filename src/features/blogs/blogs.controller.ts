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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  BasicAuthGuard,
  ObjectIdValidationPipe,
  PaginatedResponse,
  PublicApi,
  ResultNotification,
  routesConstants,
} from '../../common';
import { BlogEntity } from './entities/blog.entity';
import { FindAllBlogsQueryDto } from './dto/find-all-blogs-query.dto';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { PostEntity } from '../posts/entities/post.entity';
import { FindAllPostsQueryDto } from '../posts/dto/find-all-posts-query.dto';

const { BLOGS, POSTS } = routesConstants;

@Controller(BLOGS)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
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
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id', ObjectIdValidationPipe) id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.blogsService.remove(id);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
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
