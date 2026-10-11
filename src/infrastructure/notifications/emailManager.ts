import { emailAdapter } from '../adapters';

export const emailManager = {
  async sendConfirmationEmail(email: string, subject: string, code: string) {
    const html = `<p>To finish registration please follow the link below:\n'
      '     <a href='https://somesite.com/confirm-registration?code=${code}'>complete registration</a>\n'
      ' </p>`;
    await emailAdapter.sendEmail(email, subject, html);
  },

  async sendPasswordRecoveryEmail(email: string, subject: string, recoveryCode: string) {
    const html = `<p>Password recovery:\n'
      '     <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>\n'
      ' </p>`;
    await emailAdapter.sendEmail(email, subject, html);
  },
};
