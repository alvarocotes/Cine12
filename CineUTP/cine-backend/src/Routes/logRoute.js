const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/logController');
const User = require('../models/User'); // Añade esta línea

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);

// Ruta para verificar usuarios
router.get('/check-users', async (req, res) => {
  try {
    const users = await User.find({});
    console.log('Usuarios encontrados:', users);
    res.json(users);
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para limpiar usuarios (solo para desarrollo)
router.delete('/clear-users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ msg: 'Todos los usuarios eliminados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;