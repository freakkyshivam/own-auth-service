 
import transporter from "../../config/nodemailer.js";
import {
   accountVerificationTemplate,
   passwordResetTemplate,
   passwordResetAlertTemplate,
   welcomeTemplate,
   twoFactorEnableAlertTemplate,
   twoFactorDisableAlertTemplate,
   generateNewBackupCodeVerifyOtpTemplate
   } from "./mail.templates.js";

 

export async function sendRegisterAccountVerifyEmail(
  name: string | undefined,
  email: string,
  otp: string
) {
  const template = accountVerificationTemplate({ name, otp });

  const info = await transporter.sendMail({
    from: `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  return info.messageId;
}

export async function sendWelcomeEmail(
  name: string | undefined,
  email: string,
) {
  const template = welcomeTemplate({ name });

  const info = await transporter.sendMail({
    from: `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  return info.messageId;
}

export async function sendPasswordRestEmail(
  name: string | undefined,
  email: string,
  otp: string
) {
  const template = passwordResetTemplate({ name, otp });

  const info = await transporter.sendMail({
    from: `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  return info.messageId;
}

export async function sendPasswordRestAlertEmail(
  name: string | undefined,
  email: string,
) {
  const template = passwordResetAlertTemplate({ name });

  const info = await transporter.sendMail({
    from: `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  return info.messageId;
}

export async function sendTwoFactorEnableAlertEmail(
  name: string | undefined,
  email: string,
) {
  const template = twoFactorEnableAlertTemplate({ name });

  const info = await transporter.sendMail({
    from: `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  return info.messageId;
}

export async function sendTwoFactorDisableAlertEmail(
  name: string | undefined,
  email: string,
) {
  const template = twoFactorDisableAlertTemplate({ name });

  const info = await transporter.sendMail({
    from: `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  return info.messageId;
}

export async function sendGenerateBackupCodeOTPEmail(
  name : string | undefined,
  otp : string,
  email : string
){

  const template = generateNewBackupCodeVerifyOtpTemplate({otp, name})
  const info = await transporter.sendMail({
    from : `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to : email,
    subject : template.subject,
    text : template.text,
    html : template.html
  })
}