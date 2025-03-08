import { Injectable } from '@nestjs/common';
import { CommentEntity } from '../entities/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { FindAllCommentsQueryDto } from '../dto/find-all-comments-query.dto';
import { PaginatedResponse } from '../../../types';
import { formatPaginatedResponse } from '../../../coreUtils';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectModel(Comment.name) private readonly commentModel: Model<Comment>) {}

  async findAllComments(
    queryParams: FindAllCommentsQueryDto,
    filter?: FilterQuery<Comment>,
  ): Promise<PaginatedResponse<CommentEntity>> {
    const defaultParams = new FindAllCommentsQueryDto();
    const {
      pageNumber = defaultParams.pageNumber,
      sortDirection = defaultParams.sortDirection,
      sortBy = defaultParams.sortBy,
      pageSize = defaultParams.pageSize,
    } = queryParams;

    const totalCount = await this.commentModel.countDocuments(filter || {}).exec();
    const comments = await this.commentModel
      .find(filter || {})
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1, _id: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const items = comments.map(({ _id, content, createdAt, commentatorInfo }) => ({
      id: _id.toJSON(),
      content,
      commentatorInfo: { userId: commentatorInfo.userId.toJSON(), userLogin: commentatorInfo.userLogin },
      createdAt: new Date(createdAt || '').toISOString(),
    }));

    return formatPaginatedResponse({ page: pageNumber, items, pageSize, totalCount });
  }

  async findCommentById(id: string): Promise<CommentEntity | null> {
    const comment = await this.commentModel.findOne({ _id: id }).exec();

    if (!comment) {
      return null;
    }

    const { _id, content, createdAt, commentatorInfo } = comment;
    return {
      id: _id.toJSON(),
      content,
      createdAt: new Date(createdAt || '').toISOString(),
      commentatorInfo: { userId: commentatorInfo.userId.toJSON(), userLogin: commentatorInfo.userLogin },
    };
  }
}
