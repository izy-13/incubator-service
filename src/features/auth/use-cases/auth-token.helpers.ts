export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const createAccessTokenPayload = (userId: string, loginOrEmail: string) => ({
  sub: userId,
  loginOrEmail,
});

export const createRefreshTokenPayload = (
  userId: string,
  loginOrEmail: string,
  deviceId: string,
) => ({
  sub: userId,
  loginOrEmail,
  deviceId,
});

export const createDeviceSecurityRecord = (deviceId: string, metadata?: object) => ({
  deviceId,
  lastActiveDate: new Date().toISOString(),
  ...metadata,
});
