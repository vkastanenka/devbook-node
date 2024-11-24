// utils
import nodemailer from 'nodemailer'
import { convert } from 'html-to-text'

export const sendEmail = async (data: {
  to: string
  subject: string
  html: string
  text: string
}) => {
  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'vkastanenka@gmail.com',
    ...data,
  }

  // Create transport
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  // Send email
  await transport.sendMail(mailOptions)
}

// Sends reset password token email
export const sendResetPasswordTokenEmail = async (data: {
  to: string
  url: string
}) => {
  const html = `<div><h1>Click the link below to reset your password.</h1><a href='${data.url}'>Reset your password.</a></div>`

  await sendEmail({
    to: data.to,
    subject: 'Your password reset token (valid for only 10 minutes!)',
    html,
    text: convert(html),
  })
}
