// utils
import nodemailer from 'nodemailer'
import { convert } from 'html-to-text'

const createTransport = () => {
  if (process.env.NODE_ENV === 'production') {
    // Sendgrid in prod
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    })
  }

  // Gmail in dev
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

export const sendEmail = async (data: {
  to: string
  subject: string
  html: string
  text: string
}) => {
  // Create transport
  const transport = createTransport()

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    ...data,
  }

  // Send email
  await transport.sendMail(mailOptions)
}

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
