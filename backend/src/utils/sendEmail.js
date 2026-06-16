const { transporter } = require('../config/smtp')

async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    const error = new Error('Email service is not configured')
    error.status = 503
    error.code = 'EMAIL_NOT_CONFIGURED'
    throw error
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    })
  } catch (err) {
    console.warn(`[SMTP] Failed to send email to ${to}: ${err.message}`)

    const error = new Error('Email service failed to send email')
    error.status = 503
    error.code = 'EMAIL_SEND_FAILED'
    throw error
  }
}

module.exports = { sendEmail }
