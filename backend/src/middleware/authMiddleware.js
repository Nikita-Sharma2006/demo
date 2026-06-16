const jwt = require('jsonwebtoken')
const User = require('../models/User')

function createError(message, status = 401) {
  const err = new Error(message)
  err.status = status
  return err
}

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null

    if (!token) {
      throw createError('Authorization token is missing', 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded?.id) {
      throw createError('Invalid token', 401)
    }

    const user = await User.findById(decoded.id).select('-password -otp -otpExpiresAt')
    if (!user) {
      throw createError('User not found', 401)
    }

    req.user = { id: user._id }
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      err.status = 401
    }
    next(err)
  }
}
