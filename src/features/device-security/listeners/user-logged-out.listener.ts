import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserLoggedOutEvent } from '../../../common';
import { DeviceSecurityRepository } from '../repositories';

@Injectable()
export class UserLoggedOutListener {
  constructor(private readonly deviceSecurityRepository: DeviceSecurityRepository) {}

  @OnEvent('user.logged-out')
  async handle(event: UserLoggedOutEvent) {
    await this.deviceSecurityRepository.deleteByDeviceId(event.deviceId);
  }
}
