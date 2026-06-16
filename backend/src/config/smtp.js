const nodemailer = require('nodemailer')

const requiredSmtpVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
]

function getMissingSmtpVars() {
  return requiredSmtpVars.filter((key) => !process.env[key])
}

const missingSmtpVars = getMissingSmtpVars()
const smtpPort = Number(process.env.SMTP_PORT)

let transporter = null

if (missingSmtpVars.length > 0 || Number.isNaN(smtpPort)) {
  const missingMessage =
    missingSmtpVars.length > 0
      ? `Missing ${missingSmtpVars.join(', ')}`
      : 'SMTP_PORT must be a number'

  console.warn(`[SMTP] Email service is not configured. ${missingMessage}. OTP emails will be disabled.`)
} else {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  console.log('[SMTP] Email service configured.')
}

async function verifySmtpConnection() {
  if (!transporter) {
    console.warn('[SMTP] Skipping verification because email service is not configured.')
    return false
  }

  try {
    await transporter.verify()
    console.log('[SMTP] Verification successful.')
    return true
  } catch (err) {
    console.warn(`[SMTP] Verification failed: ${err.message}`)
    return false
  }
}

function isEmailConfigured() {
  return Boolean(transporter)
}

module.exports = {
  transporter,
  isEmailConfigured,
  verifySmtpConnection,
}
