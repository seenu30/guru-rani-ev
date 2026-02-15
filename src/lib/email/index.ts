import nodemailer from 'nodemailer';
import { logger } from '@/lib/logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const from = process.env.SMTP_FROM || 'Guru Rani <noreply@guruani.com>';

  try {
    const info = await transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    logger.info({ messageId: info.messageId, to }, 'Email sent successfully');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error({ error, to, subject }, 'Failed to send email');
    throw error;
  }
}

export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    logger.info('SMTP connection verified');
    return true;
  } catch (error) {
    logger.error({ error }, 'SMTP connection failed');
    return false;
  }
}
