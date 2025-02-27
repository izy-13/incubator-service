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
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { routesConstants, transformValidationFactory } from '../../coreUtils';
import { PostEntity } from './entities/post.entity';
import { ObjectIdValidationPipe } from '../../pipes';
import { FindAllPostsQueryDto } from './dto/find-all-posts-query.dto';
import { PaginatedResponse } from '../../types';
import { CreatePostWithBlogIdDto } from './dto/create-post-with-blogId.dto';

const { POSTS } = routesConstants;

@Controller(POSTS)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostWithBlogIdDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Query() queryParams: FindAllPostsQueryDto): Promise<PaginatedResponse<PostEntity>> {
    return this.postsService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id', ObjectIdValidationPipe) id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.postsService.remove(id);
  }
}
