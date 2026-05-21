import { Request } from 'express';

export type JwtPayload = {
  sub: string;
  loginOrEmail: string;
};

export type RequestWithJwt = Request & {
  user?: JwtPayload;
};
