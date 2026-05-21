import { hash } from 'bcrypt';

export const generateBcryptHash = async (password: string, salt: string) => {
  const passwordHash = await hash(password, salt);

  return { passwordHash };
};
