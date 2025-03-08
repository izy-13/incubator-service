import { CreateCommentDto, UpdateCommentDto } from '../dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../schemas/comment.schema';
import { CommentsQueryRepository } from './comments.query-repository';
import { Model } from 'mongoose';
import { CommentEntity } from '../entities/comment.entity';
import { JwtPayload } from '../../../types';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly queryRepository: CommentsQueryRepository,
  ) {}

  async createComment(comment: CreateCommentDto, postId: string, user: JwtPayload): Promise<CommentEntity | null> {
    const { content } = comment;
    const newComment = await this.commentModel.create({
      content,
      postId,
      commentatorInfo: { userLogin: user.loginOrEmail, userId: user.sub },
    });
    return await this.queryRepository.findCommentById(newComment._id.toJSON());
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto): Promise<boolean> {
    const result = await this.commentModel.findByIdAndUpdate({ _id: id }, updateCommentDto, { new: true }).exec();
    return !!result;
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await this.commentModel.findByIdAndDelete({ _id: id }).exec();
    return !!result;
  }

  async deleteAllComments() {
    return this.commentModel.deleteMany({}).exec();
  }
}
