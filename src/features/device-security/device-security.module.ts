import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceSecurityEntity, DeviceSecuritySchema } from './schemas/device-security.schema';
import { DeviceSecurityCommandController } from './device-security-command.controller';
import { DeviceSecurityQueryController } from './device-security-query.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { DeviceSecurityQueryRepository, DeviceSecurityRepository } from './repositories';
import { DeviceSecurityUseCases } from './use-cases';
import {
  UserLoggedInListener,
  UserLoggedOutListener,
  UserLoggedRefreshListener,
} from './listeners';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DeviceSecurityEntity.name, schema: DeviceSecuritySchema }]),
    AuthModule,
    JwtModule.register({}),
  ],
  controllers: [DeviceSecurityQueryController, DeviceSecurityCommandController],
  providers: [
    ...DeviceSecurityUseCases,
    DeviceSecurityRepository,
    DeviceSecurityQueryRepository,
    UserLoggedInListener,
    UserLoggedOutListener,
    UserLoggedRefreshListener,
  ],
  exports: [...DeviceSecurityUseCases],
})
export class DeviceSecurityModule {}
