import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  formResponse,
  ObjectIdValidationPipe,
  PublicApi,
  RequestWithJwt,
  ResultNotification,
  routesConstants,
} from '../../common';
import { CreateCommentDto } from '../comments/dto';
import { FindAllCommentsQueryDto } from '../comments/dto/find-all-comments-query.dto';
import { CreatePostCommentUseCase, FindPostCommentsUseCase } from './use-cases';

const { POSTS, COMMENTS } = routesConstants;

@Controller(POSTS)
export class PostCommentsController {
  constructor(
    private readonly findPostCommentsUseCase: FindPostCommentsUseCase,
    private readonly createPostCommentUseCase: CreatePostCommentUseCase,
  ) {}

  @PublicApi()
  @Get(`:postId/${COMMENTS}`)
  async findAllComments(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Query() queryParams: FindAllCommentsQueryDto,
  ) {
    const result = await this.findPostCommentsUseCase.execute(postId, queryParams);
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
    const result = await this.createPostCommentUseCase.execute(
      createCommentDto,
      postId,
      request?.user,
    );
    return formResponse(result);
  }
}
