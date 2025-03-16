import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { authConstants } from '../../../coreUtils';

const { PUBLIC_KEY } = authConstants;

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req.cookies?.refreshToken]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || PUBLIC_KEY,
    });
  }

  validate(req: Request, payload: object) {
    const refreshToken: string = req.cookies?.refreshToken || '';
    return { ...payload, refreshToken };
  }
}
