import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RequestLogDocument = HydratedDocument<RequestLogEntity>;

@Schema({ timestamps: true })
export class RequestLogEntity {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLogEntity);
