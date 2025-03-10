import { emailAdapter } from '../../adapters';

export const emailManager = {
  async sendConfirmationEmail(email: string, subject: string, code: string) {
    const html = `<p>To finish registration please follow the link below:\n'
      '     <a href='https://somesite.com/confirm-registration?code=${code}'>complete registration</a>\n'
      ' </p>`;
    await emailAdapter.sendEmail(email, subject, html);
  },
};
