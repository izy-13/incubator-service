import { v4 as uuidv4 } from 'uuid';
import { AuthEntity } from '../../schemas/auth.schema';

export type RegistrationCodeUpdate = {
  code: string;
  expiredAt: string;
  attempts: number;
};

export const createRegistrationCodeUpdate = (authInfo: AuthEntity): RegistrationCodeUpdate => {
  const code = authInfo.isConfirmed ? authInfo.code : uuidv4();
  const expiredAt = authInfo.isConfirmed ? authInfo.expiredAt : new Date().toISOString();

  return {
    code,
    expiredAt,
    attempts: authInfo.attempts + 1,
  };
};
