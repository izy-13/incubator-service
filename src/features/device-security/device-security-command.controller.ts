import { Controller, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ExtractCookies, PublicApi, routesConstants } from '../../common';
import { RefreshTokenGuard } from '../auth/guards';
import { RemoveAllDeviceSecurityUseCase, RemoveDeviceSecurityUseCase } from './use-cases';

const { SECURITY, DEVICES } = routesConstants;

@Controller(`${SECURITY}/${DEVICES}`)
export class DeviceSecurityCommandController {
  constructor(
    private readonly removeDeviceSecurityUseCase: RemoveDeviceSecurityUseCase,
    private readonly removeAllDeviceSecurityUseCase: RemoveAllDeviceSecurityUseCase,
  ) {}

  @PublicApi()
  @UseGuards(RefreshTokenGuard)
  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeOne() {
    return this.removeDeviceSecurityUseCase.execute();
  }

  @PublicApi()
  @UseGuards(RefreshTokenGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAll(@ExtractCookies('refreshToken') refreshToken: string) {
    return this.removeAllDeviceSecurityUseCase.execute(refreshToken);
  }
}