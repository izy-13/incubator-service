import { ClearPostsUseCase } from './clear-posts.use-case';
import { CreatePostCommentUseCase } from './create-post-comment.use-case';
import { CreatePostUseCase } from './create-post.use-case';
import { DeletePostUseCase } from './delete-post.use-case';
import { FindAllPostsUseCase } from './find-all-posts.use-case';
import { FindPostCommentsUseCase } from './find-post-comments.use-case';
import { FindPostUseCase } from './find-post.use-case';
import { FindPostsByBlogUseCase } from './find-posts-by-blog.use-case';
import { UpdatePostUseCase } from './update-post.use-case';

export * from './clear-posts.use-case';
export * from './create-post-comment.use-case';
export * from './create-post.use-case';
export * from './delete-post.use-case';
export * from './find-all-posts.use-case';
export * from './find-post-comments.use-case';
export * from './find-post.use-case';
export * from './find-posts-by-blog.use-case';
export * from './update-post.use-case';

export const PostsUseCases = [
  ClearPostsUseCase,
  CreatePostCommentUseCase,
  CreatePostUseCase,
  DeletePostUseCase,
  FindAllPostsUseCase,
  FindPostCommentsUseCase,
  FindPostUseCase,
  FindPostsByBlogUseCase,
  UpdatePostUseCase,
];