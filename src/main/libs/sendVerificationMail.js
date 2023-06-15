import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASS,
  },
});

export async function sendVerificationMail({ id, email, verificationToken }) {
  try {
    let info = await transporter.sendMail({
      from: `'${process.env.SMTP_EMAIL_NAME}'<nasimur.shellbeehaken@gmail.com>`,
      to: email,
      subject: "Verify your account on twitter",
      text: `http://localhost:3000/verify?id=${id}&token=${verificationToken}`,
      html: `<a href='http://localhost:3000/verify?id=${id}&token=${verificationToken}' style="padding:1rem; border-radius:1rem; border:1px solid blue;">Verify Email</a>`, // html body
    });
    return info;
  } catch (err) {
    console.log(err);
    return false;
  }
}
