import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceSecurityEntity, DeviceSecuritySchema } from './schemas/device-security.schema';
import { DeviceSecurityController } from './api/device-security.controller';
import { DeviceSecurityService } from './application/device-security.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { DeviceSecurityRepository } from './repositories/device-security.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DeviceSecurityEntity.name, schema: DeviceSecuritySchema }]),
    AuthModule,
    JwtModule.register({}),
  ],
  controllers: [DeviceSecurityController],
  providers: [DeviceSecurityService, DeviceSecurityRepository],
  exports: [DeviceSecurityService],
})
export class DeviceSecurityModule {}
