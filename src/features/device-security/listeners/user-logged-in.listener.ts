import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserLoggedInEvent } from '../../../common';
import { DeviceSecurityQueryRepository, DeviceSecurityRepository } from '../repositories';

@Injectable()
export class UserLoggedInListener {
  constructor(
    private readonly deviceSecurityRepository: DeviceSecurityRepository,
    private readonly deviceSecurityQueryRepository: DeviceSecurityQueryRepository,
  ) {}

  @OnEvent('user.logged-in')
  async handle(event: UserLoggedInEvent) {
    const hasRecord = await this.deviceSecurityQueryRepository.findByDeviceId(event.deviceId);

    if (!hasRecord) {
      await this.deviceSecurityRepository.create({
        userId: event.userId,
        deviceId: event.deviceId,
        ip: event.ip,
        title: event.title,
        lastActiveDate: event.lastActiveDate,
      });
    } else {
      await this.deviceSecurityRepository.update({
        userId: event.userId,
        deviceId: event.deviceId,
        ip: event.ip,
        title: event.title,
        lastActiveDate: event.lastActiveDate,
      });
    }
  }
}
