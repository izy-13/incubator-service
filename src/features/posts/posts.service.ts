import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostsQueryRepository, PostsRepository } from './repositories';

@Injectable()
export class PostsService {
  constructor(
    private readonly queryRepository: PostsQueryRepository,
    private readonly repository: PostsRepository,
  ) {}

  create(createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.repository.createPost(createPostDto);
  }

  findAll(): Promise<PostEntity[]> {
    return this.queryRepository.findAllPosts();
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

  clearAll() {
    return this.repository.deleteAllPosts();
  }
}
