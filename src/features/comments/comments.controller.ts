import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto';
import { formResponse, routesConstants, transformValidationFactory } from '../../coreUtils';
import { PublicApi } from '../../decorators';
import { ObjectIdValidationPipe } from '../../pipes';
import { CommentEntity } from './entities/comment.entity';
import { RequestWithJwt } from '../../types';

const { COMMENTS } = routesConstants;

@Controller(COMMENTS)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @PublicApi()
  @Get(':id')
  async findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<CommentEntity | null> {
    const result = await this.commentsService.findOne(id);
    return formResponse<CommentEntity | null>(result);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Req() request: RequestWithJwt,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const result = await this.commentsService.update(id, updateCommentDto, request?.user);
    return formResponse(result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() request: RequestWithJwt, @Param('id', ObjectIdValidationPipe) id: string) {
    const result = await this.commentsService.remove(id, request?.user);
    return formResponse(result);
  }
}
