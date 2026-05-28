import { Injectable } from '@nestjs/common';
import { JwtPayload, PromiseResult, ResultNotification, ResultStatus } from '../../../common';
import { CommentsQueryRepository, CommentsRepository } from '../repositories';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly queryRepository: CommentsQueryRepository,
    private readonly repository: CommentsRepository,
  ) {}

  async execute(id: string, user?: JwtPayload): PromiseResult<boolean | null> {
    const comment = await this.queryRepository.findCommentById(id);

    if (!comment) {
      return ResultNotification.error(ResultStatus.NOT_FOUND, `Comment with ID ${id} not found`);
    }

    if (comment?.commentatorInfo.userId !== user?.sub) {
      return ResultNotification.error(
        ResultStatus.FORBIDDEN_ERROR,
        'You cannot update this comment',
      );
    }

    const result = await this.repository.deleteComment(id);

    if (!result) {
      return ResultNotification.error(ResultStatus.NOT_FOUND, `Cannot delete with ID ${id}`);
    }

    return ResultNotification.success(result);
  }
}
