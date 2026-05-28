import { Injectable } from '@nestjs/common';
import { DeviceSecurityRepository } from '../repositories/device-security.repository';

@Injectable()
export class ClearDeviceSecurityUseCase {
  constructor(private readonly repository: DeviceSecurityRepository) {}

  execute() {
    return this.repository.deleteAll();
  }
}
