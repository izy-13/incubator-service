import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { decodeBase64 } from '../utils';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
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

    return true;
  }
}
