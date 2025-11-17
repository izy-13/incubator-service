import { Injectable } from '@nestjs/common';

@Injectable()
export class DeviceSecurityService {
  constructor() {}

  findAll() {
    console.log(1);
  }

  removeOne() {
    console.log(3);
  }

  removeAll(refreshToken: string) {
    console.log(refreshToken);
  }
}
