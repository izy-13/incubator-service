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
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  BasicAuthGuard,
  formResponse,
  ObjectIdValidationPipe,
  PaginatedResponse,
  PublicApi,
  RequestWithJwt,
  ResultNotification,
  routesConstants,
} from '../../common';
import { PostEntity } from './entities/post.entity';
import { FindAllPostsQueryDto } from './dto/find-all-posts-query.dto';
import { CreatePostWithBlogIdDto } from './dto/create-post-with-blogId.dto';
import { FindAllCommentsQueryDto } from '../comments/dto/find-all-comments-query.dto';
import { CreateCommentDto } from '../comments/dto';

const { POSTS, COMMENTS } = routesConstants;

@Controller(POSTS)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostWithBlogIdDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @PublicApi()
  @Get()
  findAll(@Query() queryParams: FindAllPostsQueryDto): Promise<PaginatedResponse<PostEntity>> {
    return this.postsService.findAll(queryParams);
  }

  @PublicApi()
  @Get(':id')
  findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id', ObjectIdValidationPipe) id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.postsService.remove(id);
  }

  @PublicApi()
  @Get(`:postId/${COMMENTS}`)
  async findAllComments(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Query() queryParams: FindAllCommentsQueryDto,
  ) {
    const result = await this.postsService.findAllComments(postId, queryParams);
    return formResponse(result);
  }

  @Post(`:postId/${COMMENTS}`)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Req() request: RequestWithJwt,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const result = await this.postsService.createComment(createCommentDto, postId, request?.user);
    return formResponse(result);
  }
}
