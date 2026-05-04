import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<AuthEntity>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class AuthEntity {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;

  // TODO black list token or add expiration date and check because old tokens can be used
  @Prop()
  refreshToken: string;

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

export const AuthSchema = SchemaFactory.createForClass(AuthEntity);
