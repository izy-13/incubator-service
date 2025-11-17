import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class DeviceSecurityEntity {
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
