const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

exports.postTest = (req, res) => {
  res.json({
    message: 'Test endpoint reached',
    received: req.body || null,
    mongodbState: mongoose.connection.readyState,
    cloudinaryConfigured: !!(cloudinary.config && cloudinary.config().cloud_name),
  });
};
