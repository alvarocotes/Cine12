const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const { getProfile, updateProfile } = require('../Controllers/userController');

// Rutas protegidas
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;