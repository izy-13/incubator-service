import { InjectModel } from '@nestjs/mongoose';
import { Auth } from '../schemas/auth.schema';
import { FilterQuery, Model } from 'mongoose';

export class AuthQueryRepository {
  constructor(@InjectModel(Auth.name) private readonly authModel: Model<Auth>) {}

  async findAuthInfo(filter: FilterQuery<Auth>): Promise<Auth | null> {
    return await this.authModel.findOne(filter).exec();
  }
}
