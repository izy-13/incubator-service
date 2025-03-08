import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostsQueryRepository, PostsRepository } from './repositories';
import { JwtPayload, PaginatedPromiseResult, PaginatedResponse, ResultStatus } from '../../types';
import { FindAllPostsQueryDto } from './dto/find-all-posts-query.dto';
import { CreatePostWithBlogIdDto } from './dto/create-post-with-blogId.dto';
import { CommentsService } from '../comments/comments.service';
import { FindAllCommentsQueryDto } from '../comments/dto/find-all-comments-query.dto';
import { CommentEntity } from '../comments/entities/comment.entity';
import { CreateCommentDto } from '../comments/dto';
import { errorResult } from '../../coreUtils';

@Injectable()
export class PostsService {
  constructor(
    private readonly queryRepository: PostsQueryRepository,
    private readonly repository: PostsRepository,
    private readonly commentsService: CommentsService,
  ) {}

  // TODO return only id
  create(createPostDto: CreatePostWithBlogIdDto): Promise<PostEntity> {
    return this.repository.createPost(createPostDto);
  }

  findAll(queryParams: FindAllPostsQueryDto): Promise<PaginatedResponse<PostEntity>> {
    const defaultParams = new FindAllPostsQueryDto();

    const {
      pageNumber = defaultParams.pageNumber,
      sortDirection = defaultParams.sortDirection,
      sortBy = defaultParams.sortBy,
      pageSize = defaultParams.pageSize,
    } = queryParams;

    return this.queryRepository.findAllPosts({ pageNumber, sortDirection, sortBy, pageSize });
  }

  findOne(id: string): Promise<PostEntity> {
    return this.queryRepository.findPostById(id);
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.repository.updatePost(id, updatePostDto);
  }

  remove(id: string) {
    return this.repository.deletePost(id);
  }

  findAllByBlogId(blogId: string, queryParams: FindAllPostsQueryDto): Promise<PaginatedResponse<PostEntity>> {
    const defaultParams = new FindAllPostsQueryDto();

    const {
      pageNumber = defaultParams.pageNumber,
      sortDirection = defaultParams.sortDirection,
      sortBy = defaultParams.sortBy,
      pageSize = defaultParams.pageSize,
    } = queryParams;

    // TODO should be deleted
    return this.queryRepository.findAllPostsByBlogId(blogId, { pageNumber, sortDirection, sortBy, pageSize });
  }

  async findAllComments(
    postId: string,
    queryParams: FindAllCommentsQueryDto,
  ): PaginatedPromiseResult<CommentEntity | null> {
    return this.commentsService.findAll(queryParams, { postId });
  }

  async createComment(createCommentDto: CreateCommentDto, postId: string, user?: JwtPayload) {
    const post = await this.queryRepository.findPostById(postId);

    if (!post) {
      return errorResult(ResultStatus.NOT_FOUND, `Post with ID ${postId} not found`);
    }

    return this.commentsService.create(createCommentDto, postId, user);
  }

  async clearAll() {
    await this.repository.deleteAllPosts();
    await this.commentsService.clearAll();
  }
}
