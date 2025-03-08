import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({
    required: true,
    type: new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      userLogin: { type: String, required: true },
    }),
  })
  commentatorInfo: {
    userId: Types.ObjectId;
    userLogin: string;
  };

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  postId: Types.ObjectId;

  @Prop()
  createdAt?: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
