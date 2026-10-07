import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceSecurityDocument, DeviceSecurityEntity } from '../schemas/device-security.schema';
import { UserLoggedInEvent } from '../../../common';

@Injectable()
export class DeviceSecurityRepository {
  constructor(
    @InjectModel(DeviceSecurityEntity.name)
    private readonly deviceSecurityModel: Model<DeviceSecurityDocument>,
  ) {}

  async create(event: UserLoggedInEvent) {
    return this.deviceSecurityModel.create(event);
  }

  async update(event: Partial<UserLoggedInEvent>) {
    return this.deviceSecurityModel.findOneAndUpdate(
      { deviceId: event?.deviceId },
      { lastActiveDate: event?.lastActiveDate },
    );
  }

  async deleteByDeviceId(deviceId: string) {
    return this.deviceSecurityModel.findOneAndDelete({ deviceId }).exec();
  }

  async deleteAllExcept(userId: string, deviceId: string) {
    return this.deviceSecurityModel
      .deleteMany({
        userId,
        deviceId: { $ne: deviceId },
      })
      .exec();
  }

  async deleteAll() {
    return this.deviceSecurityModel.deleteMany({}).exec();
  }
}
