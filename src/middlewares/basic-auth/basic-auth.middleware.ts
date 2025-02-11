import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { decodeBase64 } from '../../coreUtils';

// rework into guard
@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = decodeBase64(base64Credentials);
    const [username, password] = credentials.split(':');

    if (username !== process.env.ADMIN || password !== process.env.PASSWORD) {
      throw new UnauthorizedException('Invalid username or password');
    }

    next();
  }
}
