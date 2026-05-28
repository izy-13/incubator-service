import { Injectable } from '@nestjs/common';
import { UpdateCommentDto } from '../dto';
import { JwtPayload, PromiseResult, ResultNotification, ResultStatus } from '../../../common';
import { CommentsQueryRepository, CommentsRepository } from '../repositories';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private readonly queryRepository: CommentsQueryRepository,
    private readonly repository: CommentsRepository,
  ) {}

  async execute(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user?: JwtPayload,
  ): PromiseResult<boolean | null> {
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

    const result = await this.repository.updateComment(id, updateCommentDto);

    if (!result) {
      return ResultNotification.error(ResultStatus.NOT_FOUND, `Cannot update with ID ${id}`);
    }

    return ResultNotification.success(result);
  }
}
