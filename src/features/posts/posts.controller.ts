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
import { UpdatePostDto } from './dto/update-post.dto';
import {
  BasicAuthGuard,
  ObjectIdValidationPipe,
  PaginatedResponse,
  PublicApi,
  ResultNotification,
  routesConstants,
} from '../../common';
import { PostEntity } from './entities/post.entity';
import { FindAllPostsQueryDto } from './dto/find-all-posts-query.dto';
import { CreatePostWithBlogIdDto } from './dto/create-post-with-blogId.dto';
import {
  CreatePostUseCase,
  DeletePostUseCase,
  FindAllPostsUseCase,
  FindPostUseCase,
  UpdatePostUseCase,
} from './use-cases';

const { POSTS } = routesConstants;

@Controller(POSTS)
export class PostsController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly findAllPostsUseCase: FindAllPostsUseCase,
    private readonly findPostUseCase: FindPostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostWithBlogIdDto): Promise<PostEntity> {
    return this.createPostUseCase.execute(createPostDto);
  }

  @PublicApi()
  @Get()
  findAll(@Query() queryParams: FindAllPostsQueryDto): Promise<PaginatedResponse<PostEntity>> {
    return this.findAllPostsUseCase.execute(queryParams);
  }

  @PublicApi()
  @Get(':id')
  findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<PostEntity> {
    return this.findPostUseCase.execute(id);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id', ObjectIdValidationPipe) id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.updatePostUseCase.execute(id, updatePostDto);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.deletePostUseCase.execute(id);
  }
}
