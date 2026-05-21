import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceSecurityDocument, DeviceSecurityEntity } from '../schemas/device-security.schema';

@Injectable()
export class DeviceSecurityRepository {
  constructor(
    @InjectModel(DeviceSecurityEntity.name)
    private readonly deviceSecurityModel: Model<DeviceSecurityDocument>,
  ) {}

  async deleteAll() {
    return this.deviceSecurityModel.deleteMany({}).exec();
  }
}
