import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ExtractCookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return data ? request.cookies?.[data] : request.cookies;
});
