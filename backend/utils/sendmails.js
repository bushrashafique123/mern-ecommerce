import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Configure Handlebars template engine
const handlebarsOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve(__dirname, '../views/'),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, '../views/'),

}

transporter.use('compile', hbs(handlebarsOptions));

// Send email function
const sendMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: "Verify your email",
      template: 'email', // e.g., 'email' (matches views/email.hbs)
      context:{
        otp: otp,
      }  // e.g., { otp: '123456' }
    })

    console.log('✅ Email sent:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

// Send password reset email with a link
const sendResetMail = async (to, token) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}&email=${encodeURIComponent(to)}`;
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Password reset request',
      html: `
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the link below to set a new password. This link is valid for 1 hour.</p>
        <p><a href="${resetUrl}">Reset password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
    console.log('✅ Reset email sent:', info.response);
  } catch (err) {
    console.error('❌ Error sending reset email:', err);
  }
};

export default sendMail;
export { sendResetMail };
