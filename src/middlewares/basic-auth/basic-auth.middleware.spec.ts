import { BasicAuthMiddleware } from './basic-auth.middleware';

describe('BasicAuthMiddleware', () => {
  it('should be defined', () => {
    expect(new BasicAuthMiddleware()).toBeDefined();
  });
});
