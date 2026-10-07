import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserLoggedRefreshEvent } from '../../../common';
import { DeviceSecurityRepository } from '../repositories';

@Injectable()
export class UserLoggedRefreshListener {
  constructor(private readonly deviceSecurityRepository: DeviceSecurityRepository) {}

  @OnEvent('user.logged-refresh')
  async handle(event: UserLoggedRefreshEvent) {
    await this.deviceSecurityRepository.update(event);
  }
}
