const nodemailer = require('nodemailer');

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS.replace(/\s/g, '') }
  });
}

async function sendContactEmail({ name, email, message }) {
  const transporter = createTransporter();
  if (!transporter) {
    const error = new Error('SMTP_NOT_CONFIGURED');
    error.code = 'SMTP_NOT_CONFIGURED';
    throw error;
  }

  const recipient = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recipient,
    replyTo: email,
    subject: `Portfolio inquiry from ${name}`,
    text: `${message}\n\nFrom: ${name} <${email}>`
  });
}

module.exports = { sendContactEmail };
