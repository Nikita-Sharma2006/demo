const mongoose = require('mongoose');
const { isEmailConfigured } = require('../config/smtp');

exports.getHealth = (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    environment: process.env.NODE_ENV || 'development',
    emailService: isEmailConfigured() ? 'configured' : 'not_configured',
    mongodbState: mongoose.connection.readyState,
  });
};
