import { Controller, Get, Param } from '@nestjs/common';
import { formResponse, ObjectIdValidationPipe, PublicApi, routesConstants } from '../../common';
import { CommentEntity } from './entities/comment.entity';
import { FindCommentUseCase } from './use-cases';

const { COMMENTS } = routesConstants;

@Controller(COMMENTS)
export class CommentsQueryController {
  constructor(private readonly findCommentUseCase: FindCommentUseCase) {}

  @PublicApi()
  @Get(':id')
  async findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<CommentEntity | null> {
    const result = await this.findCommentUseCase.execute(id);
    return formResponse<CommentEntity | null>(result);
  }
}
