import { Injectable } from '@nestjs/common';
import { JwtPayload, PromiseResult, ResultNotification, ResultStatus } from '../../../common';
import { CreateCommentDto } from '../../comments/dto';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { CreateCommentUseCase } from '../../comments/use-cases';
import { PostsQueryRepository } from '../repositories';

@Injectable()
export class CreatePostCommentUseCase {
  constructor(
    private readonly queryRepository: PostsQueryRepository,
    private readonly createCommentUseCase: CreateCommentUseCase,
  ) {}

  async execute(
    createCommentDto: CreateCommentDto,
    postId: string,
    user?: JwtPayload,
  ): PromiseResult<CommentEntity | null> {
    const post = await this.queryRepository.findPostById(postId);

    if (!post) {
      return ResultNotification.error(ResultStatus.NOT_FOUND, `Post with ID ${postId} not found`);
    }

    return this.createCommentUseCase.execute(createCommentDto, postId, user);
  }
}
