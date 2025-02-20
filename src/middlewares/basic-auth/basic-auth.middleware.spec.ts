import { BasicAuthMiddleware } from './basic-auth.middleware';
import { UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

describe('BasicAuthMiddleware', () => {
  let middleware: BasicAuthMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    middleware = new BasicAuthMiddleware();
    req = {};
    res = {};
    next = jest.fn();
  });

  it('should throw UnauthorizedException if authorization header is missing', () => {
    req.headers = {};

    expect(() => middleware.use(req as Request, res as Response, next)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if authorization header does not start with "Basic "', () => {
    req.headers = { authorization: 'Bearer token' };

    expect(() => middleware.use(req as Request, res as Response, next)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if credentials are invalid', () => {
    req.headers = { authorization: 'Basic invalidBase64' };

    expect(() => middleware.use(req as Request, res as Response, next)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if username or password is incorrect', () => {
    req.headers = { authorization: 'Basic ' + Buffer.from('wrongUser:wrongPass').toString('base64') };

    expect(() => middleware.use(req as Request, res as Response, next)).toThrow(UnauthorizedException);
  });

  it('should call next if username and password are correct', () => {
    process.env.ADMIN = 'admin';
    process.env.PASSWORD = 'password';
    req.headers = { authorization: 'Basic ' + Buffer.from('admin:password').toString('base64') };

    middleware.use(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});
