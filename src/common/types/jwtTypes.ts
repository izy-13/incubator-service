import { Request } from 'express';

export type JwtPayload = {
  sub: string;
  loginOrEmail: string;
  deviceId: string;
};

export type RequestWithJwt = Request & {
  user?: JwtPayload;
};
