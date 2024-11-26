const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const { getProfile, updateProfile } = require('../Controllers/userController');

// Ruta: GET api/users/profile
// Descripción: Obtener perfil del usuario
// Acceso: Privado
router.get('/profile', auth, getProfile);

// Ruta: PUT api/users/profile
// Descripción: Actualizar perfil del usuario
// Acceso: Privado
router.put('/profile', auth, updateProfile);

module.exports = router;