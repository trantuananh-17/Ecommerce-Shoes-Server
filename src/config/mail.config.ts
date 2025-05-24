import dotenv from "dotenv";
dotenv.config();

const mailConfig = {
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: 587, //giá trị port mặc định của smtp
  SMTP_USER: `${process.env.SMTP_USER}`,
  SMTP_PASS: `${process.env.SMTP_PASS}`,
  FROM_EMAIL: `${process.env.FROM_EMAIL}`,
};

export default mailConfig;
