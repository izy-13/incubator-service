import { InjectModel } from '@nestjs/mongoose';
import { AuthEntity, UserEntity } from '../../entities';
import { FilterQuery, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export class AuthRepository {
  constructor(@InjectModel(UserEntity?.name) private readonly userModel: Model<UserEntity>) {}

  async updateAuthByConfirmCode(code: string): Promise<boolean> {
    const result = await this.userModel
      .findOneAndUpdate(
        { 'authInfo.code': code },
        { $set: { 'authInfo.isConfirmed': true, 'authInfo.code': code } },
        { new: true },
      )
      .exec();
    return !!result;
  }

  async registerUser(userId: string, alreadyConfirmed: boolean = false): Promise<string> {
    const code = uuidv4();
    const authInfo = {
      code,
      isConfirmed: alreadyConfirmed,
      createdAt: new Date().toISOString(),
      attempts: 0,
      refreshToken: '',
      expiresAt: '',
    };
    await this.userModel.findOneAndUpdate({ _id: userId }, { $set: { authInfo } });
    return code;
  }

  // TODO naming like update not resend
  async resendConfirmCode(userId: string, authInfo: AuthEntity): Promise<string> {
    const { isConfirmed, code } = authInfo;
    const codeProps = !isConfirmed ? uuidv4() : code;

    await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $set: { 'authInfo.code': codeProps },
          $inc: { 'authInfo.attempts': 1 },
        },
      )
      .exec();
    return codeProps;
  }

  async updateAuthInfo(filter: FilterQuery<AuthEntity>, authInfo: Partial<AuthEntity>) {
    return await this.userModel.findOneAndUpdate(filter, { $set: authInfo }, { new: true }).exec();
  }
}
