import { Injectable } from '@nestjs/common';
import { PromiseResult, ResultNotification, ResultStatus } from '../../../common';
import { CommentEntity } from '../entities/comment.entity';
import { CommentsQueryRepository } from '../repositories';

@Injectable()
export class FindCommentUseCase {
  constructor(private readonly queryRepository: CommentsQueryRepository) {}

  async execute(id: string): PromiseResult<CommentEntity | null> {
    const comment = await this.queryRepository.findCommentById(id);

    if (!comment) {
      return ResultNotification.error(ResultStatus.NOT_FOUND, `Comment with ID ${id} not found`);
    }

    return ResultNotification.success(comment);
  }
}
