import { Controller, Delete, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { routesConstants } from '../../../coreUtils';
import { DeviceSecurityService } from '../application';
import { ExtractCookies, PublicApi } from '../../../decorators';
import { RefreshTokenGuard } from './guards';

const { SECURITY, DEVICES } = routesConstants;

@Controller(`${SECURITY}/${DEVICES}`)
export class DeviceSecurityController {
  constructor(private readonly deviceSecurityService: DeviceSecurityService) {}

  @PublicApi()
  @UseGuards(RefreshTokenGuard)
  @Get()
  findAll() {
    return this.deviceSecurityService.findAll();
  }

  @PublicApi()
  @UseGuards(RefreshTokenGuard)
  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeOne() {
    return this.deviceSecurityService.removeOne();
  }

  @PublicApi()
  @UseGuards(RefreshTokenGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAll(@ExtractCookies('refreshToken') refreshToken: string) {
    return this.deviceSecurityService.removeAll(refreshToken);
  }
}
