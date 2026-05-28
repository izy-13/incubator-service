import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from '../dto';
import { CommentEntity } from '../entities/comment.entity';
import { CommentsRepository } from '../repositories';
import { JwtPayload, PromiseResult, ResultNotification, ResultStatus } from '../../../common';

@Injectable()
export class CreateCommentUseCase {
  constructor(private readonly repository: CommentsRepository) {}

  async execute(
    createCommentDto: CreateCommentDto,
    postId: string,
    user?: JwtPayload,
  ): PromiseResult<CommentEntity | null> {
    if (!user) {
      return ResultNotification.error(ResultStatus.FORBIDDEN_ERROR, 'No user');
    }

    const newComment = await this.repository.createComment(createCommentDto, postId, user);

    if (!newComment) {
      return ResultNotification.error(ResultStatus.NOT_FOUND, 'Comment was not created');
    }

    return ResultNotification.success(newComment, ResultStatus.CREATED);
  }
}
