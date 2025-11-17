import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLogEntity, RequestLogSchema } from './entities/request-log.entities';
import { RequestLogRepository } from './repositores/request-log.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: RequestLogEntity.name, schema: RequestLogSchema }])],
  providers: [RequestLogRepository],
  exports: [RequestLogRepository],
})
export class RequestLogModule {}
