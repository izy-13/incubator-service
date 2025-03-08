import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsQueryRepository, CommentsRepository } from './repositories';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentsQueryRepository, CommentsRepository],
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
  exports: [CommentsService],
})
export class CommentsModule {}
