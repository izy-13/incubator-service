import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class Auth {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  isConfirmed: boolean;

  @Prop({ required: true })
  expiredAt: string;

  @Prop({ required: true })
  attempts: number;

  @Prop()
  createdAt?: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
