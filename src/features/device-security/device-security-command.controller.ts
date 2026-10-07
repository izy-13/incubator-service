import { Controller, Delete, HttpCode, HttpStatus, Param, Req, UseGuards } from '@nestjs/common';
import { PublicApi, RequestWithJwt, routesConstants } from '../../common';
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
  removeOne(@Req() request: RequestWithJwt, @Param('deviceId') deviceId: string) {
    const userId = request?.user?.sub ?? '';
    return this.removeDeviceSecurityUseCase.execute(deviceId, userId);
  }

  @PublicApi()
  @UseGuards(RefreshTokenGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAll(@Req() request: RequestWithJwt) {
    const userId = request?.user?.sub ?? '';
    const deviceId = request?.user?.deviceId || '';

    return this.removeAllDeviceSecurityUseCase.execute(deviceId, userId);
  }
}
