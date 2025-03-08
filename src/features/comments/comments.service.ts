import { Injectable } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { JwtPayload, PaginatedPromiseResult, PromiseResult, ResultStatus } from '../../types';
import { CommentEntity } from './entities/comment.entity';
import { CommentsQueryRepository, CommentsRepository } from './repositories';
import { errorResult, successResult } from '../../coreUtils';
import { FindAllCommentsQueryDto } from './dto/find-all-comments-query.dto';
import { FilterQuery } from 'mongoose';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    private readonly queryRepository: CommentsQueryRepository,
    private readonly repository: CommentsRepository,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    postId: string,
    user?: JwtPayload,
  ): PromiseResult<CommentEntity | null> {
    if (!user) {
      return errorResult(ResultStatus.FORBIDDEN_ERROR, 'No user');
    }

    const newComment = await this.repository.createComment(createCommentDto, postId, user);

    if (!newComment) {
      return errorResult(ResultStatus.NOT_FOUND, 'Comment was not created');
    }
    return successResult(ResultStatus.CREATED, newComment);
  }

  async findAll(
    queryParams: FindAllCommentsQueryDto,
    filter?: FilterQuery<Comment>,
  ): PaginatedPromiseResult<CommentEntity | null> {
    const data = await this.queryRepository.findAllComments(queryParams, filter);

    if (!data.items.length) {
      return errorResult(ResultStatus.NOT_FOUND, 'No comments found');
    }

    return successResult(ResultStatus.SUCCESS, data);
  }

  async findOne(id: string): PromiseResult<CommentEntity | null> {
    const comment = await this.queryRepository.findCommentById(id);

    if (!comment) {
      return errorResult(ResultStatus.NOT_FOUND, `Comment with ID ${id} not found`);
    }

    return successResult(ResultStatus.SUCCESS, comment);
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user?: JwtPayload): PromiseResult<boolean | null> {
    const comment = await this.queryRepository.findCommentById(id);

    if (!comment) {
      return errorResult(ResultStatus.NOT_FOUND, `Comment with ID ${id} not found`);
    }

    if (comment?.commentatorInfo.userId !== user?.sub) {
      return errorResult(ResultStatus.FORBIDDEN_ERROR, 'You cannot update this comment');
    }

    const result = await this.repository.updateComment(id, updateCommentDto);

    if (!result) {
      return errorResult(ResultStatus.NOT_FOUND, `Cannot update with ID ${id}`);
    }

    return successResult(ResultStatus.SUCCESS, result);
  }

  async remove(id: string, user?: JwtPayload): PromiseResult<boolean | null> {
    const comment = await this.queryRepository.findCommentById(id);

    if (!comment) {
      return errorResult(ResultStatus.NOT_FOUND, `Comment with ID ${id} not found`);
    }

    if (comment?.commentatorInfo.userId !== user?.sub) {
      return errorResult(ResultStatus.FORBIDDEN_ERROR, 'You cannot update this comment');
    }

    const result = await this.repository.deleteComment(id);

    if (!result) {
      return errorResult(ResultStatus.NOT_FOUND, `Cannot delete with ID ${id}`);
    }

    return successResult(ResultStatus.SUCCESS, result);
  }

  async clearAll() {
    await this.repository.deleteAllComments();
  }
}
