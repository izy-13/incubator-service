import { ClearAuthUseCase } from './clear-auth.use-case';
import { ConfirmCodeUseCase } from './confirm-code.use-case';
import { FindMeUseCase } from './find-me.use-case';
import { LoginUseCase } from './login.use-case';
import { LogoutUseCase } from './logout.use-case';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { RegisterUseCase } from './register.use-case';
import { ResendEmailUseCase } from './resend-email.use-case';
import { PasswordRecoveryUseCase } from './password-recovery.use-case';
import { NewPasswordUseCase } from './new-password.use-case';

export * from './clear-auth.use-case';
export * from './confirm-code.use-case';
export * from './find-me.use-case';
export * from './login.use-case';
export * from './logout.use-case';
export * from './refresh-token.use-case';
export * from './register.use-case';
export * from './resend-email.use-case';
export * from './password-recovery.use-case';
export * from './new-password.use-case';

export const AuthUseCases = [
  ClearAuthUseCase,
  ConfirmCodeUseCase,
  FindMeUseCase,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  RegisterUseCase,
  ResendEmailUseCase,
  PasswordRecoveryUseCase,
  NewPasswordUseCase,
];
