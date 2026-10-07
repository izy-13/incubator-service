import { Injectable } from '@nestjs/common';
import { DeviceSecurityQueryRepository } from '../repositories/device-security.query-repository';

@Injectable()
export class FindAllDeviceSecurityUseCase {
  constructor(private readonly queryRepository: DeviceSecurityQueryRepository) {}

  execute(userId: string) {
    return this.queryRepository.findByUserId(userId);
  }
}
