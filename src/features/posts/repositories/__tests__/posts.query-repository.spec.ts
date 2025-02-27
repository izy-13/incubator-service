import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostsQueryRepository } from '../posts.query-repository';
import { PostDb } from '../../schemas/post.schema';
import { NotFoundException } from '@nestjs/common';
import { dbConnect, dbDisconnect } from '../../../../coreUtils';

describe('PostsQueryRepository', () => {
  let postsQueryRepository: PostsQueryRepository;
  const connection: mongoose.Connection = mongoose.connection;
  let postModel: Model<PostDb>;

  beforeAll(async () => {
    await dbConnect();

    const postSchema = new mongoose.Schema({
      title: String,
      content: String,
      shortDescription: String,
      createdAt: Date,
      blogId: mongoose.Types.ObjectId,
      blogName: String,
    });

    postModel = connection.model<PostDb>('Post', postSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsQueryRepository,
        {
          provide: getModelToken(PostDb.name),
          useValue: postModel,
        },
      ],
    }).compile();

    postsQueryRepository = module.get<PostsQueryRepository>(PostsQueryRepository);
  });

  afterAll(async () => {
    await dbDisconnect();
  });

  beforeEach(async () => {
    await postModel.deleteMany({});
  });

  it('should return an empty array when no posts exist', async () => {
    const posts = await postsQueryRepository.findAllPosts({} as any);
    expect(posts.items).toEqual([]);
  });

  it('should return all posts', async () => {
    await postModel.create({
      title: 'Test Post',
      content: 'Test Content',
      shortDescription: 'Short desc',
      createdAt: new Date(),
      blogId: new mongoose.Types.ObjectId(),
      blogName: 'Test Blog',
    });

    const posts = await postsQueryRepository.findAllPosts({} as any);
    expect(posts.items).toHaveLength(1);
    expect(posts.items[0].title).toBe('Test Post');
  });

  it('should return a post by ID', async () => {
    const post = await postModel.create({
      title: 'Test Post',
      content: 'Test Content',
      shortDescription: 'Short desc',
      createdAt: new Date(),
      blogId: new mongoose.Types.ObjectId(),
      blogName: 'Test Blog',
    });

    const foundPost = await postsQueryRepository.findPostById(post._id.toString());
    expect(foundPost.title).toBe(post.title);
  });

  it('should throw NotFoundException if post is not found', async () => {
    await expect(postsQueryRepository.findPostById(new mongoose.Types.ObjectId().toString())).rejects.toThrow(
      NotFoundException,
    );
  });
});
