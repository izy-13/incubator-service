import { Controller, Get, UseGuards } from '@nestjs/common';
import { PublicApi, routesConstants } from '../../common';
import { RefreshTokenGuard } from '../auth/guards';
import { FindAllDeviceSecurityUseCase } from './use-cases';

const { SECURITY, DEVICES } = routesConstants;

@Controller(`${SECURITY}/${DEVICES}`)
export class DeviceSecurityQueryController {
  constructor(private readonly findAllDeviceSecurityUseCase: FindAllDeviceSecurityUseCase) {}

  @PublicApi()
  @UseGuards(RefreshTokenGuard)
  @Get()
  findAll() {
    return this.findAllDeviceSecurityUseCase.execute();
  }
}
