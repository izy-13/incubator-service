import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DeviceDeletedEvent } from '../../../common';
import { AuthRepository } from '../repositories';

@Injectable()
export class DeviceDeletedListener {
  constructor(private readonly authRepository: AuthRepository) {}

  @OnEvent('device.deleted')
  async handle(event: DeviceDeletedEvent) {
    if (event.isDeleteAllExcludeCurrent) {
      await this.authRepository.deleteAllByDeviceIdExcept(event.deviceId);
      return;
    }

    await this.authRepository.deleteByDeviceId(event.deviceId);
  }
}
