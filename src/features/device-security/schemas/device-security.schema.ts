import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DeviceSecurityDocument = HydratedDocument<DeviceSecurityEntity>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class DeviceSecurityEntity {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  lastActiveDate: string;

  @Prop({ required: true })
  deviceId: string;
}

export const DeviceSecuritySchema = SchemaFactory.createForClass(DeviceSecurityEntity);
