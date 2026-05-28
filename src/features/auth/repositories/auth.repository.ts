import { InjectModel } from '@nestjs/mongoose';
import { AuthEntity } from '../schemas/auth.schema';
import { Model } from 'mongoose';
import { createAuthInfoPayload } from './helpers/auth-payloads';
import { createRegistrationCodeUpdate } from './helpers/auth-updates';

export class AuthRepository {
  constructor(@InjectModel(AuthEntity.name) private readonly authModel: Model<AuthEntity>) {}

  async confirmRegistrationByCode(code: string): Promise<boolean> {
    const result = await this.authModel
      .findOneAndUpdate({ code }, { confirmCode: code, isConfirmed: true }, { new: true })
      .exec();
    return !!result;
  }

  async createAuthInfoForUser(userId: string, alreadyConfirmed: boolean = false): Promise<string> {
    const authInfo = createAuthInfoPayload(userId, alreadyConfirmed);
    await this.authModel.create(authInfo);
    return authInfo.code;
  }

  async updateRegistrationCode(userId: string, authInfo: AuthEntity): Promise<string> {
    const update = createRegistrationCodeUpdate(authInfo);

    await this.authModel.findOneAndUpdate({ userId }, update).exec();
    return update.code;
  }

  async saveRefreshTokenByUserId(userId: string, refreshToken: string) {
    return await this.authModel.findOneAndUpdate({ userId }, { refreshToken }).exec();
  }

  async replaceRefreshToken(oldRefreshToken: string, newRefreshToken: string) {
    return await this.authModel
      .findOneAndUpdate({ refreshToken: oldRefreshToken }, { refreshToken: newRefreshToken })
      .exec();
  }

  async clearRefreshToken(refreshToken: string) {
    return await this.authModel.findOneAndUpdate({ refreshToken }, { refreshToken: '' }).exec();
  }

  async deleteAll() {
    return this.authModel.deleteMany({}).exec();
  }
}
