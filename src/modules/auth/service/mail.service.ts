import { sendMail } from "../../../shared/service/mail.service";

export const sendVerification = async (email: string, link: string) => {
  sendMail({
    to: email,
    subject: "Xác thực tài khoản",
    html: `<p>Vui lòng click <a href="${link}">vào đây</a> để xác thực tài khoản.</p>`,
  });
};
