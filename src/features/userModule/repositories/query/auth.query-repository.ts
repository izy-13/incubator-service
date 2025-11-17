import { InjectModel } from '@nestjs/mongoose';
import { AuthEntity, UserEntity } from '../../entities';
import { FilterQuery, Model } from 'mongoose';

export class AuthQueryRepository {
  constructor(@InjectModel(UserEntity?.name) private readonly userModel: Model<UserEntity>) {}

  async findAuthInfo(filter: FilterQuery<UserEntity>): Promise<AuthEntity | null> {
    const result = await this.userModel.findOne(filter).exec();
    return result?.authInfo ?? null;
  }
}
