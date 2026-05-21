import { Injectable } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import {
  JwtPayload,
  PaginatedPromiseResult,
  PromiseResult,
  ResultNotification,
  ResultStatus,
} from '../../common';
import { CommentEntity } from './entities/comment.entity';
import { CommentsQueryRepository, CommentsRepository } from './repositories';
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
      return ResultNotification.error(ResultStatus.FORBIDDEN_ERROR, 'No user');
    }

    const newComment = await this.repository.createComment(createCommentDto, postId, user);

    if (!newComment) {
      return ResultNotification.error(ResultStatus.NOT_FOUND, 'Comment was not created');
    }
    return ResultNotification.success(newComment, ResultStatus.CREATED);
  }

  async findAll(
    queryParams: FindAllCommentsQueryDto,
    filter?: FilterQuery<Comment>,
  ): PaginatedPromiseResult<CommentEntity | null> {
    const data = await this.queryRepository.findAllComments(queryParams, filter);

    if (!data.items.length) {
      return ResultNotification.error(ResultStatus.NOT_FOUND, 'No comments found');
    }

    return ResultNotification.success(data);
  }

  async findOne(id: string): PromiseResult<CommentEntity | null> {
    const comment = await this.queryRepository.findCommentById(id);

    if (!comment) {
      return ResultNotification.error(ResultStatus.NOT_FOUND, `Comment with ID ${id} not found`);
    }

    return ResultNotification.success(comment);
  }

  async update(
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

  async remove(id: string, user?: JwtPayload): PromiseResult<boolean | null> {
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

  async clearAll() {
    await this.repository.deleteAllComments();
  }
}
