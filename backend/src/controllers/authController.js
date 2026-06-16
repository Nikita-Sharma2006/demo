const bcrypt = require('bcryptjs')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const generateOtp = require('../utils/generateOtp')
const { sendEmail } = require('../utils/sendEmail')
const { isEmailConfigured } = require('../config/smtp')

const otpExpiresInMinutes = Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10

function createError(message, status = 400) {
  const error = new Error(message)
  error.status = status
  return error
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function sendOtpUnavailableResponse(res) {
  return res.status(503).json({
    success: false,
    message: 'Email service is not configured. OTP cannot be sent.',
  })
}

function handleEmailError(err, res, next) {
  if (err.code === 'EMAIL_NOT_CONFIGURED') {
    return sendOtpUnavailableResponse(res)
  }

  if (err.code === 'EMAIL_SEND_FAILED') {
    return res.status(503).json({
      success: false,
      message: 'Email service failed to send OTP. Please contact admin.',
    })
  }

  return next(err)
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw createError('Name, email and password are required', 400)
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw createError('User already exists with this email', 400)
    }

    if (!isEmailConfigured()) {
      return sendOtpUnavailableResponse(res)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOtp()
    const hashedOtp = await bcrypt.hash(otp, 10)
    const otpExpiresAt = new Date(Date.now() + otpExpiresInMinutes * 60 * 1000)

    await sendEmail({
      to: email,
      subject: 'Verify your email',
      text: `Your registration OTP is ${otp}. It expires in ${otpExpiresInMinutes} minutes.`,
      html: `<p>Your registration OTP is <strong>${otp}</strong>.</p><p>It expires in ${otpExpiresInMinutes} minutes.</p>`,
    })

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiresAt,
      isEmailVerified: false,
    })

    res.status(201).json({
      message: 'Registration successful. OTP sent to your email.',
    })
  } catch (err) {
    return handleEmailError(err, res, next)
  }
}

exports.verifyRegisterOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      throw createError('Email and OTP are required', 400)
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || !user.otp) {
      throw createError('Invalid email or OTP', 400)
    }

    if (user.isEmailVerified) {
      throw createError('Email already verified', 400)
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw createError('OTP has expired. Please request a new login attempt.', 400)
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp)
    if (!isOtpValid) {
      throw createError('Invalid OTP', 400)
    }

    user.isEmailVerified = true
    user.otp = undefined
    user.otpExpiresAt = undefined
    await user.save()

    const token = generateToken(user._id)
    res.json({
      message: 'Email verified successfully',
      token,
      user: formatUser(user),
    })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw createError('Email and password are required', 400)
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      throw createError('Invalid credentials', 401)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw createError('Invalid credentials', 401)
    }

    if (!user.isEmailVerified) {
      throw createError('Email not verified. Please complete registration first.', 403)
    }

    if (!isEmailConfigured()) {
      return sendOtpUnavailableResponse(res)
    }

    const otp = generateOtp()
    const hashedOtp = await bcrypt.hash(otp, 10)
    const otpExpiresAt = new Date(Date.now() + otpExpiresInMinutes * 60 * 1000)

    await sendEmail({
      to: email,
      subject: 'Your login OTP',
      text: `Your login OTP is ${otp}. It expires in ${otpExpiresInMinutes} minutes.`,
      html: `<p>Your login OTP is <strong>${otp}</strong>.</p><p>It expires in ${otpExpiresInMinutes} minutes.</p>`,
    })

    user.otp = hashedOtp
    user.otpExpiresAt = otpExpiresAt
    await user.save()

    res.json({
      message: 'Login OTP sent to your email',
    })
  } catch (err) {
    return handleEmailError(err, res, next)
  }
}

exports.verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      throw createError('Email and OTP are required', 400)
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || !user.otp) {
      throw createError('Invalid email or OTP', 400)
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw createError('OTP has expired. Please request a new login attempt.', 400)
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp)
    if (!isOtpValid) {
      throw createError('Invalid OTP', 400)
    }

    user.otp = undefined
    user.otpExpiresAt = undefined
    await user.save()

    const token = generateToken(user._id)
    res.json({
      message: 'Login verified successfully',
      token,
      user: formatUser(user),
    })
  } catch (err) {
    next(err)
  }
}

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiresAt')
    if (!user) {
      throw createError('User not found', 404)
    }

    res.json({ user: formatUser(user) })
  } catch (err) {
    next(err)
  }
}
