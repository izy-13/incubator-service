import { Controller, Delete, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { routesConstants } from '../../../common';
import { DeviceSecurityService } from '../application/device-security.service';
import { ExtractCookies, PublicApi } from '../../../common';
import { RefreshTokenGuard } from '../../auth/guards';

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
