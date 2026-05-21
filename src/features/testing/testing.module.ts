import { Module } from '@nestjs/common';
import { TestingService } from './testing.service';
import { TestingController } from './testing.controller';
import { BlogsModule } from '../blogs/blogs.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../user/users.module';
import { AuthModule } from '../auth/auth.module';
import { DeviceSecurityModule } from '../device-security/device-security.module';

@Module({
  controllers: [TestingController],
  providers: [TestingService],
  imports: [BlogsModule, PostsModule, UsersModule, AuthModule, DeviceSecurityModule],
})
export class TestingModule {}
