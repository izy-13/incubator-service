import { Injectable, NotFoundException } from '@nestjs/common';
import { DeviceSecurityQueryRepository, DeviceSecurityRepository } from '../repositories';
import { DeviceDeletedEvent } from '../../../common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RemoveAllDeviceSecurityUseCase {
  constructor(
    private readonly repository: DeviceSecurityRepository,
    private readonly queryRepository: DeviceSecurityQueryRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(deviceId: string, userId: string) {
    const devices = await this.queryRepository.findByUserId(userId);

    if (!devices.length) {
      throw new NotFoundException('Device Security Not Found');
    }

    await this.repository.deleteAllExcept(userId, deviceId);

    this.eventEmitter.emit('device.deleted', new DeviceDeletedEvent(deviceId, true));
  }
}
