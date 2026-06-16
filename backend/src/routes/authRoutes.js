const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', authController.register)
router.post('/verify-register-otp', authController.verifyRegisterOtp)
router.post('/login', authController.login)
router.post('/verify-login-otp', authController.verifyLoginOtp)
router.get('/profile', authMiddleware, authController.getProfile)

module.exports = router
