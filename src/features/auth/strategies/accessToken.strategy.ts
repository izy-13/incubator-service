import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../types';
import { authConstants } from '../../../coreUtils';

const { PUBLIC_KEY } = authConstants;

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || PUBLIC_KEY,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
