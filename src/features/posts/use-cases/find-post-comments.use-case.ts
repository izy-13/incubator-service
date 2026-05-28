import { Injectable } from '@nestjs/common';
import { PaginatedPromiseResult } from '../../../common';
import { FindAllCommentsQueryDto } from '../../comments/dto/find-all-comments-query.dto';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { FindAllCommentsUseCase } from '../../comments/use-cases';

@Injectable()
export class FindPostCommentsUseCase {
  constructor(private readonly findAllCommentsUseCase: FindAllCommentsUseCase) {}

  async execute(
    postId: string,
    queryParams: FindAllCommentsQueryDto,
  ): PaginatedPromiseResult<CommentEntity | null> {
    return this.findAllCommentsUseCase.execute(queryParams, { postId });
  }
}