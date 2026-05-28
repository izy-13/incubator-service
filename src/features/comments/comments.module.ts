import { Module } from '@nestjs/common';
import { CommentsCommandController } from './comments-command.controller';
import { CommentsQueryController } from './comments-query.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsQueryRepository, CommentsRepository } from './repositories';
import { CommentsUseCases } from './use-cases';

@Module({
  controllers: [CommentsQueryController, CommentsCommandController],
  providers: [...CommentsUseCases, CommentsQueryRepository, CommentsRepository],
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
  exports: [...CommentsUseCases],
})
export class CommentsModule {}
