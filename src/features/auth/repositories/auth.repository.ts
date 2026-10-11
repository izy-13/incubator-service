import { InjectModel } from '@nestjs/mongoose';
import { AuthEntity } from '../schemas/auth.schema';
import { FilterQuery, Model } from 'mongoose';
import { createAuthInfoPayload } from './helpers/auth-payloads';
import { createRecoveryCode, createRegistrationCodeUpdate } from './helpers/auth-updates';

export class AuthRepository {
  constructor(@InjectModel(AuthEntity.name) private readonly authModel: Model<AuthEntity>) {}

  async confirmRegistrationByCode(code: string): Promise<boolean> {
    const result = await this.authModel
      .findOneAndUpdate({ code }, { confirmCode: code, isConfirmed: true }, { new: true })
      .exec();
    return !!result;
  }

  async createAuthInfoForUser(
    userId: string,
    deviceId: string,
    alreadyConfirmed: boolean = false,
  ): Promise<string> {
    const authInfo = createAuthInfoPayload(userId, alreadyConfirmed);
    await this.authModel.create({ ...authInfo, deviceId });
    return authInfo.code;
  }

  async createAuthInfoForUserWithToken(
    userId: string,
    refreshToken: string,
    deviceId: string,
    alreadyConfirmed: boolean = false,
  ) {
    const authInfo = createAuthInfoPayload(userId, alreadyConfirmed);
    await this.authModel.create({ ...authInfo, refreshToken, deviceId });
  }

  async updateRegistrationCode(userId: string, authInfo: AuthEntity): Promise<string> {
    const update = createRegistrationCodeUpdate(authInfo);

    await this.authModel.findOneAndUpdate({ userId }, update).exec();
    return update.code;
  }

  async createRegistrationCode(userId: string): Promise<string> {
    const { recoveryCode, recoveryCodeExpiredAt } = createRecoveryCode();
    await this.authModel
      .findOneAndUpdate(
        { userId },
        { recoveryCode, recoveryCodeExpiredAt },
        { upsert: true, new: true },
      )
      .exec();
    return recoveryCode;
  }

  async saveRefreshTokenByUserId(userId: string, refreshToken: string) {
    return await this.authModel.findOneAndUpdate({ userId }, { refreshToken }).exec();
  }

  async saveRefreshToken(userId: string, deviceId: string, refreshToken: string) {
    return this.authModel
      .findOneAndUpdate({ userId, deviceId }, { refreshToken }, { new: true })
      .exec();
  }

  async replaceRefreshToken(oldRefreshToken: string, newRefreshToken: string) {
    return await this.authModel
      .findOneAndUpdate({ refreshToken: oldRefreshToken }, { refreshToken: newRefreshToken })
      .exec();
  }

  async clearRefreshToken(refreshToken: string) {
    return await this.authModel.findOneAndUpdate({ refreshToken }, { refreshToken: '' }).exec();
  }

  async deleteByDeviceId(deviceId: string) {
    return await this.authModel.findOneAndDelete({ deviceId }).exec();
  }

  async deleteAllByDeviceIdExcept(deviceId: string) {
    return this.authModel
      .deleteMany({
        deviceId: { $ne: deviceId },
      })
      .exec();
  }

  async updateAuthInfo(filter: FilterQuery<AuthEntity>, data: Partial<AuthEntity>) {
    return await this.authModel.findOneAndUpdate(filter, { $set: data }).exec();
  }

  async deleteAll() {
    return this.authModel.deleteMany({}).exec();
  }
}
