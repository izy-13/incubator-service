import { InjectModel } from '@nestjs/mongoose';
import { AuthEntity } from '../schemas/auth.schema';
import { FilterQuery, Model } from 'mongoose';

export class AuthQueryRepository {
  constructor(@InjectModel(AuthEntity.name) private readonly authModel: Model<AuthEntity>) {}

  async findByCode(code: string): Promise<AuthEntity | null> {
    return await this.authModel.findOne({ code }).exec();
  }

  async findByUserId(userId: string): Promise<AuthEntity | null> {
    return await this.authModel.findOne({ userId }).exec();
  }

  async findByRefreshToken(refreshToken: string): Promise<AuthEntity | null> {
    return await this.authModel.findOne({ refreshToken }).exec();
  }

  async findAuthInfo(filter: FilterQuery<AuthEntity>): Promise<AuthEntity | null> {
    return await this.authModel.findOne(filter).exec();
  }
}
