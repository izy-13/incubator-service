import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import { BlogEntity } from './entities/blog.entity';
import { BlogsQueryRepository, BlogsRepository } from './repositories';
import { FindAllBlogsQueryDto } from './dto/find-all-blogs-query.dto';
import { PaginatedResponse } from '../../types';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { PostEntity } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { FindAllPostsQueryDto } from '../posts/dto/find-all-posts-query.dto';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(forwardRef(() => PostsService))
    @InjectModel(Blog.name)
    private readonly postsService: PostsService,
    private readonly queryRepository: BlogsQueryRepository,
    private readonly repository: BlogsRepository,
  ) {}

  create(createBlogDto: CreateBlogDto): Promise<BlogEntity | void> {
    return this.repository.createBlog(createBlogDto);
  }

  findAll(queryParams: FindAllBlogsQueryDto): Promise<PaginatedResponse<BlogEntity>> {
    const defaultParams = new FindAllBlogsQueryDto();
    const {
      pageNumber = defaultParams.pageNumber,
      sortDirection = defaultParams.sortDirection,
      sortBy = defaultParams.sortBy,
      searchNameTerm,
      pageSize = defaultParams.pageSize,
    } = queryParams;

    return this.queryRepository.findAllBlogs({ pageNumber, sortDirection, sortBy, searchNameTerm, pageSize });
  }

  findOne(id: string): Promise<BlogEntity> {
    return this.queryRepository.findBlogById(id);
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.repository.updateBlog(id, updateBlogDto);
  }

  remove(id: string) {
    return this.repository.deleteBlog(id);
  }

  clearAll() {
    return this.repository.deleteAllBlogs();
  }

  findAllPosts(blogId: string, queryParams: FindAllPostsQueryDto): Promise<PaginatedResponse<PostEntity>> {
    return this.postsService.findAllByBlogId(blogId, queryParams);
  }

  createPost(blogId: string, createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create({ ...createPostDto, blogId });
  }
}
