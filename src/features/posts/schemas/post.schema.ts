import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<PostDb>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class PostDb {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Blog' })
  blogId: Types.ObjectId;

  @Prop({ required: true })
  blogName: string;

  @Prop()
  createdAt?: string;
}

export const PostSchema = SchemaFactory.createForClass(PostDb);
