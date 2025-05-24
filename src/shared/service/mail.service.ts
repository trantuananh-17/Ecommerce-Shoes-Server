import nodemailer from "nodemailer";
import mailConfig from "../../config/mail.config";

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: mailConfig.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: mailConfig.SMTP_USER,
    pass: mailConfig.SMTP_PASS,
  },
});

export async function sendMail(options: MailOptions) {
  const mailOptions = {
    from: mailConfig.FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
