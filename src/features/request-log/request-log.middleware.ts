import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestLogRepository } from './repositores/request-log.repository';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly requestLogRepository: RequestLogRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.socket.remoteAddress || req.headers['x-forwarded-for'] || req.ip;
    const url = req.baseUrl || req.originalUrl;

    if (!ip || !url) {
      return next();
    }

    const ipAddress = Array.isArray(ip) ? ip.join(';') : ip;
    const requestCount = await this.requestLogRepository.countRecentRequests(ipAddress, url);

    if (requestCount >= 100) {
      throw new BadRequestException('Too many requests from this IP');
    }

    await this.requestLogRepository.logRequest(ipAddress, url);

    next();
  }
}
