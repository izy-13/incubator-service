import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostsRepository } from '../posts.repository';
import { PostDb } from '../../schemas/post.schema';
import { NotFoundException } from '@nestjs/common';
import { dbConnect, dbDisconnect } from '../../../../coreUtils';
import { BlogsService } from '../../../blogs/blogs.service';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { CreatePostWithBlogIdDto } from '../../dto/create-post-with-blogId.dto';

describe('PostsRepository', () => {
  let postsRepository: PostsRepository;
  let blogsService: BlogsService;
  let postModel: Model<PostDb>;

  const connection: mongoose.Connection = mongoose.connection;

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

    blogsService = {
      findOne: jest.fn().mockResolvedValue({ id: new mongoose.Types.ObjectId().toString(), name: 'Test Blog' }),
    } as unknown as BlogsService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsRepository,
        { provide: BlogsService, useValue: blogsService },
        { provide: getModelToken(PostDb.name), useValue: postModel },
      ],
    }).compile();

    postsRepository = module.get<PostsRepository>(PostsRepository);
  });

  afterAll(async () => {
    await dbDisconnect();
  });

  beforeEach(async () => {
    await postModel.deleteMany({});
  });

  it('should create a post', async () => {
    const createPostDto: CreatePostWithBlogIdDto = {
      title: 'New Post',
      content: 'Some content',
      shortDescription: 'Short description',
      blogId: new mongoose.Types.ObjectId().toString(),
    };

    const post = await postsRepository.createPost(createPostDto);

    expect(post).toMatchObject({
      title: createPostDto.title,
      content: createPostDto.content,
      shortDescription: createPostDto.shortDescription,
      blogName: 'Test Blog',
    });
  });

  it('should update a post', async () => {
    const post = await postModel.create({
      title: 'Old Title',
      content: 'Old Content',
      shortDescription: 'Old Description',
      createdAt: new Date(),
      blogId: new mongoose.Types.ObjectId(),
      blogName: 'Test Blog',
    });

    const updateDto: UpdatePostDto = { title: 'Updated Title' } as UpdatePostDto;

    await postsRepository.updatePost(post._id.toString(), updateDto);

    const updatedPost = await postModel.findById(post._id).lean();
    expect(updatedPost?.title).toBe(updateDto.title);
  });

  it('should throw NotFoundException when updating a non-existing post', async () => {
    await expect(
      postsRepository.updatePost(new mongoose.Types.ObjectId().toString(), { title: 'New Title' } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a post', async () => {
    const post = await postModel.create({
      title: 'Delete Me',
      content: 'Content',
      shortDescription: 'Description',
      createdAt: new Date(),
      blogId: new mongoose.Types.ObjectId(),
      blogName: 'Test Blog',
    });

    await postsRepository.deletePost(post._id.toString());

    const deletedPost = await postModel.findById(post._id);
    expect(deletedPost).toBeNull();
  });

  it('should throw NotFoundException when deleting a non-existing post', async () => {
    await expect(postsRepository.deletePost(new mongoose.Types.ObjectId().toString())).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete all posts', async () => {
    await postModel.create([
      {
        title: 'Post 1',
        content: 'Content 1',
        shortDescription: 'Desc 1',
        createdAt: new Date(),
        blogId: new mongoose.Types.ObjectId(),
        blogName: 'Test Blog',
      },
      {
        title: 'Post 2',
        content: 'Content 2',
        shortDescription: 'Desc 2',
        createdAt: new Date(),
        blogId: new mongoose.Types.ObjectId(),
        blogName: 'Test Blog',
      },
    ]);

    await postsRepository.deleteAllPosts();

    const remainingPosts = await postModel.find();
    expect(remainingPosts).toHaveLength(0);
  });
});
