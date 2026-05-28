import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveAllDeviceSecurityUseCase {
  execute(refreshToken: string) {
    console.log(refreshToken);
  }
}