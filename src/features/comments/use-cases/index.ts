import { ClearCommentsUseCase } from './clear-comments.use-case';
import { CreateCommentUseCase } from './create-comment.use-case';
import { DeleteCommentUseCase } from './delete-comment.use-case';
import { FindAllCommentsUseCase } from './find-all-comments.use-case';
import { FindCommentUseCase } from './find-comment.use-case';
import { UpdateCommentUseCase } from './update-comment.use-case';

export * from './clear-comments.use-case';
export * from './create-comment.use-case';
export * from './delete-comment.use-case';
export * from './find-all-comments.use-case';
export * from './find-comment.use-case';
export * from './update-comment.use-case';

export const CommentsUseCases = [
  ClearCommentsUseCase,
  CreateCommentUseCase,
  DeleteCommentUseCase,
  FindAllCommentsUseCase,
  FindCommentUseCase,
  UpdateCommentUseCase,
];
