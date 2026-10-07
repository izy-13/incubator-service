import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceSecurityEntity } from '../schemas/device-security.schema';
import { Model } from 'mongoose';
import { DeviceViewModelType } from '../viewModel';

@Injectable()
export class DeviceSecurityQueryRepository {
  constructor(
    @InjectModel(DeviceSecurityEntity.name)
    private deviceSecurityModel: Model<DeviceSecurityEntity>,
  ) {}

  async findByDeviceId(deviceId: string) {
    return await this.deviceSecurityModel.findOne({ deviceId }).exec();
  }

  async findByUserId(userId: string) {
    return await this.deviceSecurityModel.find({ userId }).then((result) => {
      if (!result) {
        return [];
      } else {
        return result.map(({ deviceId, ip, lastActiveDate, title }) => ({
          deviceId,
          ip,
          lastActiveDate,
          title,
        }));
      }
    });
  }

  async findAll(): Promise<DeviceViewModelType[]> {
    return await this.deviceSecurityModel.find().then((result) => {
      if (!result) {
        return [];
      } else {
        return result.map(({ deviceId, ip, lastActiveDate, title }) => ({
          deviceId,
          ip,
          lastActiveDate,
          title,
        }));
      }
    });
  }
}
