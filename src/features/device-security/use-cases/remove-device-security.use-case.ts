import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DeviceSecurityQueryRepository, DeviceSecurityRepository } from '../repositories';
import { DeviceDeletedEvent } from '../../../common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RemoveDeviceSecurityUseCase {
  constructor(
    private readonly repository: DeviceSecurityRepository,
    private readonly queryRepository: DeviceSecurityQueryRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(deviceId: string, userId: string) {
    const device = await this.queryRepository.findByDeviceId(deviceId);

    if (!device) {
      throw new NotFoundException('Device Security Not Found');
    }

    if (device.userId?.toString() !== userId) {
      throw new ForbiddenException('You cannot delete this device');
    }

    this.eventEmitter.emit('device.deleted', new DeviceDeletedEvent(deviceId));

    await this.repository.deleteByDeviceId(deviceId);
  }
}
