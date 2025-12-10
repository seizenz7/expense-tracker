const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Membuat router untuk auth
const router = express.Router();

// Register user baru
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user (butuh token)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;