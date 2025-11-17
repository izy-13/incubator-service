import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuthEntity } from './auth.entities';
import { DeviceSecurityEntity } from './deviceSecurity.entites';

export type UserDocument = HydratedDocument<UserEntity>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class UserEntity {
  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordSalt: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: AuthEntity })
  authInfo: AuthEntity;

  @Prop({ type: [DeviceSecurityEntity] })
  devices: DeviceSecurityEntity[];

  @Prop()
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
