import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class AuthEntity {
  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  isConfirmed: boolean;

  @Prop({ required: true })
  attempts: number;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  expiresAt: string;
}

export const AuthSchema = SchemaFactory.createForClass(AuthEntity);
