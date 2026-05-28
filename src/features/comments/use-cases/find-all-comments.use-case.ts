import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { PaginatedPromiseResult, ResultNotification, ResultStatus } from '../../../common';
import { CommentEntity } from '../entities/comment.entity';
import { CommentsQueryRepository } from '../repositories';
import { Comment } from '../schemas/comment.schema';
import { FindAllCommentsQueryDto } from '../dto/find-all-comments-query.dto';

@Injectable()
export class FindAllCommentsUseCase {
  constructor(private readonly queryRepository: CommentsQueryRepository) {}

  async execute(
    queryParams: FindAllCommentsQueryDto,
    filter?: FilterQuery<Comment>,
  ): PaginatedPromiseResult<CommentEntity | null> {
    const data = await this.queryRepository.findAllComments(queryParams, filter);

    if (!data.items.length) {
      return ResultNotification.error(ResultStatus.NOT_FOUND, 'No comments found');
    }

    return ResultNotification.success(data);
  }
}
