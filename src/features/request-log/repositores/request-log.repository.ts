import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestLogDocument, RequestLogEntity } from '../entities/request-log.entities';

@Injectable()
export class RequestLogRepository {
  constructor(@InjectModel(RequestLogEntity.name) private requestLogModel: Model<RequestLogDocument>) {}

  async logRequest(ip: string, url: string): Promise<RequestLogEntity> {
    return this.requestLogModel.create({ ip, url, date: new Date() });
  }

  async countRecentRequests(ip: string, url: string): Promise<number> {
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);

    return this.requestLogModel.countDocuments({
      ip,
      url,
      date: { $gte: tenSecondsAgo },
    });
  }
}
