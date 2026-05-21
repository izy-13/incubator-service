import { Injectable } from '@nestjs/common';
import { DeviceSecurityRepository } from '../repositories/device-security.repository';

@Injectable()
export class DeviceSecurityService {
  constructor(private readonly repository: DeviceSecurityRepository) {}

  findAll() {
    console.log(1);
  }

  removeOne() {
    console.log(3);
  }

  removeAll(refreshToken: string) {
    console.log(refreshToken);
  }

  async clearAll() {
    return this.repository.deleteAll();
  }
}
