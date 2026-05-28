import { ClearDeviceSecurityUseCase } from './clear-device-security.use-case';
import { FindAllDeviceSecurityUseCase } from './find-all-device-security.use-case';
import { RemoveAllDeviceSecurityUseCase } from './remove-all-device-security.use-case';
import { RemoveDeviceSecurityUseCase } from './remove-device-security.use-case';

export * from './clear-device-security.use-case';
export * from './find-all-device-security.use-case';
export * from './remove-all-device-security.use-case';
export * from './remove-device-security.use-case';

export const DeviceSecurityUseCases = [
  ClearDeviceSecurityUseCase,
  FindAllDeviceSecurityUseCase,
  RemoveAllDeviceSecurityUseCase,
  RemoveDeviceSecurityUseCase,
];
