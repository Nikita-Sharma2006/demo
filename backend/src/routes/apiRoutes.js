const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const { getHealth } = require('../controllers/healthController');
const { postTest } = require('../controllers/testController');

router.use('/auth', authRoutes);

// Health check
router.get('/health', getHealth);

// Simple test endpoint to verify frontend -> backend
router.post('/test', postTest);

module.exports = router;
