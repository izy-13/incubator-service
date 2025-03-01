import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class User {
  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordSalt: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
