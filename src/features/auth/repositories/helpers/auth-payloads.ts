import { v4 as uuidv4 } from 'uuid';

export type AuthInfoCreatePayload = {
  code: string;
  userId: string;
  isConfirmed: boolean;
  expiredAt: string;
  attempts: number;
  refreshToken: string;
};

export const createAuthInfoPayload = (
  userId: string,
  alreadyConfirmed: boolean = false,
): AuthInfoCreatePayload => ({
  code: uuidv4(),
  userId,
  isConfirmed: alreadyConfirmed,
  expiredAt: new Date().toISOString(),
  attempts: 0,
  refreshToken: '',
});
