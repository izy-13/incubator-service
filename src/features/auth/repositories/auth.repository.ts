import { InjectModel } from '@nestjs/mongoose';
import { Auth } from '../schemas/auth.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export class AuthRepository {
  constructor(@InjectModel(Auth.name) private readonly authModel: Model<Auth>) {}

  async updateAuthByConfirmCode(code: string): Promise<boolean> {
    const result = await this.authModel
      .findOneAndUpdate({ code }, { confirmCode: code, isConfirmed: true }, { new: true })
      .exec();
    return !!result;
  }

  async registerUser(userId: string, alreadyConfirmed: boolean = false): Promise<string> {
    const code = uuidv4();
    await this.authModel.create({
      code,
      userId,
      isConfirmed: alreadyConfirmed,
      expiredAt: new Date().toISOString(),
      attempts: 0,
    });
    return code;
  }

  async resendConfirmCode(userId: string, authInfo: Auth): Promise<string> {
    const { attempts, isConfirmed, code } = authInfo;
    const codeProps = !isConfirmed ? uuidv4() : code;
    const dateProps = !isConfirmed ? new Date().toISOString() : authInfo.expiredAt;

    await this.authModel
      .findOneAndUpdate({ userId }, { code: codeProps, expiredAt: dateProps, attempts: attempts + 1 })
      .exec();
    return codeProps;
  }

  async deleteAll() {
    return this.authModel.deleteMany({}).exec();
  }
}
