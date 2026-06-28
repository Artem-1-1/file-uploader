import { SMTP_HOST, SMTP_USER, SMTP_PASS } from "$env/static/private";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendEmail({to, subject, text} : { to: string, subject: string, text: string }) {
  try {
    await transporter.sendMail({
      from: SMTP_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}