import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// __dirname fix for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * =========================
 * SMTP TRANSPORTER
 * =========================
 * Gmail recommended config:
 * - port: 587
 * - secure: false
 * - MUST use App Password (not Gmail password)
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true only for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, 
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});


const handlebarsOptions = {
  viewEngine: {
    extname: ".hbs",
    partialsDir: path.resolve(__dirname, "../views/"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../views/"),
};

transporter.use("compile", hbs(handlebarsOptions));

const sendMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, 
      to,
      subject: "Verify your email",
      template: "email",
      context: { otp },
    });

    console.log("✅ Email sent successfully");
    console.log("Message ID:", info.messageId);

    return true;
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error(error);

    return false;
  }
};

export default sendMail;