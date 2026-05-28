import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceSecurityEntity, DeviceSecuritySchema } from './schemas/device-security.schema';
import { DeviceSecurityCommandController } from './device-security-command.controller';
import { DeviceSecurityQueryController } from './device-security-query.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { DeviceSecurityRepository } from './repositories/device-security.repository';
import { DeviceSecurityUseCases } from './use-cases';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DeviceSecurityEntity.name, schema: DeviceSecuritySchema }]),
    AuthModule,
    JwtModule.register({}),
  ],
  controllers: [DeviceSecurityQueryController, DeviceSecurityCommandController],
  providers: [...DeviceSecurityUseCases, DeviceSecurityRepository],
  exports: [...DeviceSecurityUseCases],
})
export class DeviceSecurityModule {}
