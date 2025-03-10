import * as nodemailer from 'nodemailer';

export const emailAdapter = {
  sendEmail: async (email: string, subject: string, html: string) => {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transport.sendMail({
      from: `IT-service <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: html,
    });
  },
};
